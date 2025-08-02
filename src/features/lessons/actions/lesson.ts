"use server";
import { getCurrentUser } from "@/services/clerk";
import {
    canCreateLesson,
    canDeleteLesson,
    canUpdateLesson
} from "../permissions/lessons";
import { lessonSchema } from "../schema/lesson";
import z from "zod";
import {
    getNextCourseLessonOrder,
    insertLesson,
    updateLesson as updateLessonDB,
    deleteLesson as deleteLessonDB,
    updateLessonOrder as updateLessonsOrderDB
} from "../db/lessons";


export async function createLesson(unsafeData: z.infer<typeof lessonSchema>) {
    const { success, data } = lessonSchema.safeParse(unsafeData);

    if (!success) {
        return { error: true, message: "there was an error creating your lesson." }
    }
    else if (!canCreateLesson(await getCurrentUser())) {
        return { error: true, message: "you are not authorised to create lessons." }
    }

    const order = await getNextCourseLessonOrder(data.sectionId);
    await insertLesson({ ...data, order });


    return { error: false, message: "lesson created successfully" }
}


export async function updateLesson(id: string,
    unsafeData: z.infer<typeof lessonSchema>) {

    const { success, data } = lessonSchema.safeParse(unsafeData);

    if (!success) {
        return { error: true, message: "there was an error updating your lesson." }
    }
    else if (!canUpdateLesson(await getCurrentUser())) {
        return { error: true, message: "you are not authorised to update lesson." }
    }

    await updateLessonDB(id, data);

    return { error: false, message: "Successfully updated the lesson." }

}

export async function deleteLesson(id: string) {

    if (!canDeleteLesson(await getCurrentUser())) {
        return { error: true, message: "Error deleting your course." }
    }
    await deleteLessonDB(id);

    return { error: false, message: "Successfully deleted your course" }
}

export async function updateLessonsOrder(lessonIds: string[]) {
    if (lessonIds.length === 0 || !canUpdateLesson(await getCurrentUser())) {
        return { error: true, message: "could not re-order sections." }
    }

    await updateLessonsOrderDB(lessonIds);

    return { error: true, message: "successfully re-ordered your sections." }
}
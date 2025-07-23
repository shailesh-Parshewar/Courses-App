

import { CourseLessonTable, CourseSectionTable } from "@/drizzle/schema";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { revalidateLessonsCache } from "./cache/lessons";


export async function getNextCourseLessonOrder(sectionId: string) {

    // gets the number of sections for a course
    const lesson = await db.query.CourseLessonTable.findFirst({
        columns: { order: true },
        where: ({ sectionId: sectionIdCol }, { eq }) => eq(sectionIdCol, sectionId),
        orderBy: ({ order }, { desc }) => desc(order),
    })
    return lesson ? lesson.order + 1 : 0;
}


export async function insertLesson(data: typeof CourseLessonTable.$inferInsert) {
    const [newLesson, courseId] = await db.transaction(async trx => {
        // creating a transaction.
        const [[newLesson], section] = await Promise.all([
            trx.insert(CourseLessonTable).values(data).returning(),
            trx.query.CourseSectionTable.findFirst({
                columns: { courseId: true },
                where: eq(CourseSectionTable.id, data.sectionId)
            })
        ])

        if (section == null) return trx.rollback();
        return [newLesson, section.courseId]
    })

    if (!newLesson) throw new Error("failed to create new lesson.");

    revalidateLessonsCache({ courseId, id: newLesson.id });

    return newLesson;
}
export async function updateLesson(id: string, data: Partial<typeof CourseLessonTable.$inferInsert>) {
    const [updatedLesson, courseId] = await db.transaction(async trx => {
        const currentLesson = await trx.query.CourseLessonTable.findFirst({
            where: eq(CourseLessonTable.id, id),
            columns: { sectionId: true }
        })
        // check if :
        // sectionId exists and 
        // if it doesn't match with previous sectionId
        //  and if order property doesn't exist.
        if (data.sectionId != null
            && currentLesson?.sectionId !== data.sectionId
            && data.order == null) {
            data.order = await getNextCourseLessonOrder(data.sectionId);
        }

        const [updatedLesson] = await trx
            .update(CourseLessonTable)
            .set(data)
            .where(eq(CourseLessonTable.id, id))
            .returning()

        if (updatedLesson == null) throw new Error("could not update lesson.");

        const section = await db.query.CourseSectionTable.findFirst({
            columns: { courseId: true },
            where: eq(CourseSectionTable.id, updatedLesson.sectionId)
        })
    })

    if (!updatedLesson) throw new Error("failed to update lesson.");

    revalidateLessonsCache({ courseId, id: updatedLesson.id });

    return updatedLesson;
}


export async function deleteLesson(id: string) {
    const [deletedSection] = await db
        .delete(CourseLessonTable)
        .where(eq(CourseLessonTable.id, id))
        .returning();

    if (deletedSection == null) throw new Error("failed to delete lesson.")

    revalidateCourseLessonCache({
        id: deletedSection.id,
        courseId: deletedSection.courseId
    });
    return deletedSection;
}

export async function updateLessonOrder(sectionIds: string[]) {
    const sections = await Promise.all(
        sectionIds.map((id, index) =>
            db.update(CourseLessonTable)
                .set({ order: index })
                .where(eq(CourseLessonTable.id, id))
                .returning({
                    courseId: CourseLessonTable.courseId,
                    id: CourseLessonTable.id
                }))
    )
    sections.flat().forEach(({ id, courseId }) => (
        revalidateCourseLessonCache({ id, courseId })
    ))
}

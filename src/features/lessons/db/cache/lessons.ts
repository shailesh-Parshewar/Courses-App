import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getLessonGlobalTag() {
    return getGlobalTag("lesson");
}
export function getLessonIdTag(id: string) {
    return getIdTag("lesson", id)
}
export function getLessonCourseTag(courseId: string) {
    return getCourseTag("lesson",courseId)
}

export function revalidateLessonsCache({ id, courseId }  : {
        id: string,
        courseId: string
    }) {
        revalidateTag(getLessonGlobalTag())
        revalidateTag(getLessonIdTag(id))
        revalidateTag(getLessonCourseTag(courseId))
    }


import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getCourseSectionGlobalTag() {
    return getGlobalTag("courseSection")
}

export function getCourseSectionIdTag(Id: string) {
    return getIdTag("courseSection", Id)
}

export function getCourseSectionCourseTag(courseId: string) {

    return getCourseTag("userCourseAccess", courseId);
}

export function revalidateCourseSectionCache({
    id,
    courseId }
    : {
        id: string,
        courseId: string
    }) {
    revalidateTag(getCourseSectionGlobalTag())
    revalidateTag(getCourseSectionIdTag(id))
    revalidateTag(getCourseSectionCourseTag(courseId))
}
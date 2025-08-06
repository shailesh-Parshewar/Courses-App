import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getUserLessonCompleteGlobalTag() {
    return getGlobalTag("userLessonComplete");
}
export function getUserLessonCompleteIdTag({lessonId, userId} : {lessonId : string, userId : string}) {
    return getIdTag("userLessonComplete", `lesson:${lessonId}-user:${userId}`)
}
export function getUserLessonCompleteUserTag(userId : string) {
    return getUserTag("userLessonComplete", userId)
}

export function revalidateLessonCompleteCache({userId, lessonId} : {userId :string, lessonId : string}) {
    revalidateTag(getUserLessonCompleteGlobalTag());
    revalidateTag(getUserLessonCompleteIdTag({userId, lessonId}));
    revalidateTag(getUserLessonCompleteUserTag(userId))
}
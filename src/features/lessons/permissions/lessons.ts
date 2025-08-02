

import { CourseLessonTable, userRole } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";

export function canCreateLesson({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}
export function canUpdateLesson({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

export function canDeleteLesson({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

export const wherePublicLesson = or(
    eq(CourseLessonTable.status, "public")
    , eq(CourseLessonTable.status, "preview"));
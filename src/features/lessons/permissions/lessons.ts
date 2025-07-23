

import { userRole } from "@/drizzle/schema";

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
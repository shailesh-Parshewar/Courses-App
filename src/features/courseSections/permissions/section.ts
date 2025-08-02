import { CourseSectionTable, userRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canCreateSection({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}
export function canUpdateSection({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

export function canDeleteSection({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

export const wherePublicCourseSections = eq(CourseSectionTable.status, "public")
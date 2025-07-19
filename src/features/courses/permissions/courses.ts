import { userRole } from "@/drizzle/schema";

export function canCreateCourses({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

export function canDeleteCourses({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}
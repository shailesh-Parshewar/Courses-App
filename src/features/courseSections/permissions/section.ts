import { userRole } from "@/drizzle/schema";

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
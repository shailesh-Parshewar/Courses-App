import { ProductTable, userRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canCreateProducts({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}
export function canUpdateProducts({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

export function canDeleteProducts({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}
export const wherePublicProducts = eq(ProductTable.status, "public")
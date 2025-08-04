import { ProductTable, userRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canRefundPurchases({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

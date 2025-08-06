import { userRole } from "@/drizzle/schema";


export function canRefundPurchases({ role }
    : { role: userRole | undefined }) {
    return role === "admin"
}

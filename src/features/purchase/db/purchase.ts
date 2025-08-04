import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";
import { revalidatePurchaseCache } from "./cache/purchase";
import { eq } from "drizzle-orm";


export async function insertPurchase(
    data: typeof PurchaseTable.$inferInsert,
    trx: Omit<typeof db, "$client"> = db
) {
    const details = data.productDetails;


    const [newPurchase] = await trx
        .insert(PurchaseTable)
        .values({
            ...data,
            productDetails: {
                name: details.name,
                description: details.description,
                imageUrl: details.imageUrl
            }
        })
        .onConflictDoNothing()
        .returning();

    if (newPurchase != null) {
        revalidatePurchaseCache(newPurchase);
        console.log("revalidated cache for purchases")
    }
    console.log("new : ", newPurchase == null)
    return newPurchase;
}

export async function updatePurchase(
    purchaseId: string,
    data: Partial<typeof PurchaseTable.$inferInsert>,
    trx: Omit<typeof db, "$client"> = db) {
    const details = data.productDetails;
    const [updatedPurchase] = await trx.update(PurchaseTable)
        .set({
            ...data,
            productDetails: details ? {
                name: details.name,
                description: details.description,
                imageUrl: details.imageUrl,
            } : undefined,
        })
        .where(eq(PurchaseTable.id, purchaseId))
        .returning();

    if (updatedPurchase == null) throw new Error("Failed to update purchase.");
    revalidatePurchaseCache(updatedPurchase);
    return updatedPurchase;
}
import { db } from "@/drizzle/db";
import { PurchaseTable } from "@/drizzle/schema";
import { revalidatePurchaseCache } from "./cache/purchase";


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


        console.log("new : " , newPurchase == null)
    return  newPurchase;
}
import { db } from "@/drizzle/db";
import { CourseProductTable, ProductTable, PurchaseTable } from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidateProductCache } from "./cache/products";


export async function userOwnsProducts(userId: string, productId: string) {
    
    // check if the user has purchased the product, if the purchased the product's id matches the productId and that they have not refunded it.
    const existingPurchase = await db.query.PurchaseTable.findFirst({
        where: and(
            eq(PurchaseTable.userId, userId), 
            eq(PurchaseTable.productId, productId), 
            isNull(PurchaseTable.refundedAt)
        )
    })

    return existingPurchase != null;

}

export async function insertProduct(data: typeof ProductTable.$inferInsert & { courseIds: string[] }) {
    const newProduct = await db.transaction(async trx => {

        const [newProduct] = await trx
            .insert(ProductTable)
            .values(data)
            .returning();

        if (!newProduct) {
            trx.rollback();
            throw new Error("failed to create new product.");
        }

        await trx.insert(CourseProductTable).values(data.courseIds.map(courseId => ({
            productId: newProduct.id,
            courseId
        })))

        return newProduct;
    })

    revalidateProductCache(newProduct.id);

    return newProduct;
}

export async function updateProduct(
    id: string,
    data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }) {

    const updatedProduct = await db.transaction(async trx => {

        const [updatedProduct] = await trx
            .update(ProductTable)
            .set(data)
            .where(eq(ProductTable.id, id))
            .returning();

        if (!updatedProduct) {
            trx.rollback();
            throw new Error("failed to create new product.");
        }

        await trx.delete(CourseProductTable).where(eq(CourseProductTable.productId, updatedProduct.id));

        await trx.insert(CourseProductTable).values(data.courseIds.map(courseId => ({
            productId: updatedProduct.id,
            courseId: courseId
        })))

        return updatedProduct
    })


    revalidateProductCache(updatedProduct.id);

    return updatedProduct;
}

export async function deleteProduct(id: string) {

    const [deletedProduct] = await db.delete(ProductTable).where(eq(ProductTable.id, id)).returning();

    if (!deletedProduct) throw new Error("failed to delete product.")

    revalidateProductCache(deletedProduct.id)
}
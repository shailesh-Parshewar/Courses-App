import { db } from "@/drizzle/db";
import { ProductTable, PurchaseTable, UserCourseAccessTable } from "@/drizzle/schema";
import { revalidateUserCourseAccessCache } from "./cache/userCourseAccess";
import { and, eq, inArray, isNull } from "drizzle-orm";

export async function insertUserCourseAccess(
    { userId, courseIds }
        : {
            userId: string,
            courseIds: string[]
        },
    trx: Omit<typeof db, "$client"> = db
) {
    const accesses = await trx
        .insert(UserCourseAccessTable)
        .values(courseIds.map(courseId => ({ userId, courseId })))
        .onConflictDoNothing()
        .returning();

    accesses.map(revalidateUserCourseAccessCache);
    return accesses;
}


export async function revokeUserCourseAccess(
    {
        userId,
        productId
    }: {
        userId: string,
        productId: string
    },
    trx: Omit<typeof db, "$client"> = db
) {
    const validPurchases = await trx.query.PurchaseTable.findMany({
        where: and(eq(PurchaseTable.userId, userId), isNull(PurchaseTable.refundedAt)),
        with: {
            product: { with: { product: { columns: { courseId: true } } } }
        }
    })

    const refundedPurchase = await trx.query.ProductTable.findFirst({
        where: eq(ProductTable.id, productId),
        with: { product: { columns: { courseId: true } } }
    })
    if (refundedPurchase == null) return;

    const validCourseIds = validPurchases
        .flatMap(p => p.product.product.map(course => course.courseId))

    const removeCourseIds = refundedPurchase.product
        .flatMap(courseProduct => courseProduct.courseId)
        .filter(courseId => !validCourseIds.includes(courseId));

    const revokedAccesses = await trx.delete(UserCourseAccessTable)
        .where(and(
            eq(UserCourseAccessTable.userId, userId),
            inArray(UserCourseAccessTable.courseId, removeCourseIds)
        ))
        .returning();

    revokedAccesses.forEach(revalidateUserCourseAccessCache);
    return revokedAccesses;
}
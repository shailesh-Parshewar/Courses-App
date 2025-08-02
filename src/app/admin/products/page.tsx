import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import React from 'react'
import { db } from '@/drizzle/db'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import {
    CourseProductTable,
    ProductTable as DbProductTable,
    PurchaseTable
} from '@/drizzle/schema'
import {
    asc,
    countDistinct,
    eq
} from 'drizzle-orm'

import { getGlobalProductsTag } from '@/features/products/db/cache/products'
import ProductTable from '@/features/products/components/ProductTable'

const ProductsPage = async () => {
    const products = await getProducts();
    return (
        <div className='container my-6'>
            <PageHeader title="Products">
                <Button asChild>
                    <Link href="/admin/products/new">New Product</Link>
                </Button>
            </PageHeader>
            <div>
                <ProductTable products={products} />
            </div>
        </div>
    )
}

export default ProductsPage;

async function getProducts() {
    "use cache";

    cacheTag(getGlobalProductsTag())

    return db.select({
        id: DbProductTable.id,
        name: DbProductTable.name,
        status: DbProductTable.status,
        price: DbProductTable.price,
        description: DbProductTable.description,
        imageUrl: DbProductTable.imageUrl,
        courseCount: countDistinct(CourseProductTable.courseId),
        customerCount: countDistinct(PurchaseTable.userId)
    }).from(DbProductTable)
        .leftJoin(CourseProductTable, eq(CourseProductTable.productId, DbProductTable.id))
        .leftJoin(PurchaseTable, eq(PurchaseTable.productId, DbProductTable.id))
        .orderBy(asc(DbProductTable.name)).groupBy(DbProductTable.id)

}
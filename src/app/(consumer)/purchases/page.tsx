import PageHeader from '@/components/PageHeader'

import { Button } from '@/components/ui/button'
import UserPurchaseTable,
 { UserPurchaseTableSkeleton } from '@/features/purchase/components/UserPurchaseTable'
import { db } from '@/drizzle/db'
import { PurchaseTable } from '@/drizzle/schema'
import { getPurchaseUserTag } from '@/features/purchase/db/cache/purchase'
import { getCurrentUser } from '@/services/clerk'
import { desc, eq } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import Link from 'next/link'
import React, { Suspense } from 'react'

const PurchasePage = () => {
  return (
    <div className='container my-6'>
        <PageHeader title='Purchase History' />
        <Suspense fallback={<UserPurchaseTableSkeleton />} >
        <SuspenseBoundary />
        </Suspense>
    </div>
  )
}

export default PurchasePage;

async function SuspenseBoundary() {
    const {userId, redirectToSignIn} = await getCurrentUser(); 
    if(userId ==  null ) return redirectToSignIn();

    const purchases = await getPurchases(userId);
    if(purchases.length == 0 ) {
return <div className='flex flex-col gap-2 items-start'>
   <p>You have made no purchases yet.</p>
   <Button asChild size={"lg"}> 
    <Link href={"/"} >Browse Courses</Link>
   </Button>
</div>
    }

    return <UserPurchaseTable purchases={purchases} />
}


async function getPurchases(userId : string) {
"use cache";

cacheTag(getPurchaseUserTag(userId));
    return db.query.PurchaseTable.findMany({
        where: eq(PurchaseTable.userId, userId),
        columns: {
            id : true,
        pricePaid: true,
        refundedAt: true,
        productDetails: true,
        createdAt: true
        },
        orderBy: desc(PurchaseTable.createdAt)
    })
}
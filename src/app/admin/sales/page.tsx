import PageHeader from '@/components/PageHeader';
import { db } from '@/drizzle/db';
import { PurchaseTable as DbPurchaseTable } from '@/drizzle/schema';
import { getGlobalPurchaseTag } from '@/features/purchase/db/cache/purchase';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { desc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import React from 'react'

const SalesPage = async () => {
    const sales = await getPurchases();


  return <div className='container my-6'>
    <PageHeader title='Sales' />
   <PurchaseTable purchases={sales} />
  </div>
}

export default SalesPage;


async function getPurchases() {
    "use cache";
    cacheTag(getGlobalPurchaseTag(), getUserGlobalTag())
    return db.query.PurchaseTable.findMany({
        columns : {
          id: true,
          pricePaid: true,
          refundedAt: true,
          productDetails: true,
          createdAt: true
        },
        orderBy: desc(DbPurchaseTable.createdAt),
        with : {
            user: { columns : { name: true, }}
        }
    }
    )
}
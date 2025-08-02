import { Button } from '@/components/ui/button';
import { db } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { getProductIdTag } from '@/features/products/db/cache/products';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { and, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

const PurchaseSuccessPage = async ({
  params
}: {
  params: Promise<{ productId: string }>
}) => {
  const { productId } = await params;
  const product = await getPublicProduct(productId);
  if (product == null) return notFound();
  return (
    <div className='container my-6'>
      <div className='flex gap-16 items-center justify-between'>
        <div className='flex flex-col gap-4 items-start'>
          <h2 className='text-3xl font-semibold'> Purchase Successful</h2>
          <p className='text-xl'> Thank you for purchasing {product?.name} </p>
          <Button asChild className='text-xl h-auto py-6 px-8 rounded-lg'>
            <Link href="/courses">View your Courses</Link>
          </Button>
        </div>
        <div className='relative aspect-video max-w-lg flex-grow'>
          <Image 
          src={product.imageUrl} 
          alt={product.name} 
          fill 
          className='object-cover rounded-xl' />
        </div>
      </div>
    </div>
  )
}

export default PurchaseSuccessPage;

async function getPublicProduct(productId: string) {
  "use cache";
  cacheTag(getProductIdTag(productId));

  return db.query.ProductTable.findFirst({
    columns: {
      name: true,
      imageUrl: true,
    },
    where: and(eq(ProductTable.id, productId), wherePublicProducts),
  })
}
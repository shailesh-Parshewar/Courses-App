import { db } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { getGlobalProductsTag } from '@/features/products/db/cache/products';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import React from 'react'
import ProductCard from '../../features/products/components/ProductCard';

const page = async () => {
  const products = await getAllPublicProducts();
  return (
    <div className='container my-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {products.map(product =>
          <ProductCard
            key={product.id}
           {...product}
          />
        )}
      </div>
    </div>
  )
}

export default page;

async function getAllPublicProducts() {
  "use cache";
  cacheTag(getGlobalProductsTag())

  return db.query.ProductTable.findMany({
    columns: {
      name: true,
      id: true,
      description: true,
      price: true,
      imageUrl: true,

    },
    where: wherePublicProducts,
    orderBy: asc(ProductTable.name),
  })

}
import PageHeader from '@/components/PageHeader'
import { db } from '@/drizzle/db'
import { CourseProductTable, CourseTable, ProductTable } from '@/drizzle/schema'
import { getGlobalCoursesTag } from '@/features/courses/db/cache/courses'
import ProductForm from '@/features/products/components/ProductForm'
import { getGlobalProductsTag, getProductIdTag } from '@/features/products/db/cache/products'
import { asc, countDistinct, eq } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { notFound } from 'next/navigation'
import React from 'react'

const NewProductPage = async ({params } : { params : Promise<{ productId : string }>}) => {
    const { productId } = await params;
    const product = await getProduct(productId);
    if(product == null) return notFound();
    
  return (
    <div className='container my-6'>
      <PageHeader title="New Product" />
      <ProductForm courses={await getCourses()} 
      product={{...product,
     courseIds : product.product.map(c => c.courseId)
    }}
        /> 
    </div>
  )
}

export default NewProductPage;

async function getCourses() {
    "use cache"
    cacheTag(getGlobalCoursesTag())
    return db.query.CourseTable.findMany({
        orderBy: asc(CourseTable.name),
        columns : {id : true,name : true}
    })
}
async function getProduct(id :string) {
    "use cache"
    cacheTag(getProductIdTag(id))
    return db.query.ProductTable.findFirst({
        columns : {
            id : true,
            name : true,
            description : true,
            status  :true,
            price : true,
         imageUrl : true,   
        },
        where : eq(ProductTable.id , id),
        with : {
           product : {columns : { courseId : true, createdAt : true }}
        }
    })
}
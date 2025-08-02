import PageHeader from '@/components/PageHeader'
import { db } from '@/drizzle/db'
import { CourseTable } from '@/drizzle/schema'
import { getGlobalCoursesTag } from '@/features/courses/db/cache/courses'
import ProductForm from '@/features/products/components/ProductForm'
import { asc } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import React from 'react'

const NewProductPage = async () => {
  return (
    <div className='container my-6'>
      <PageHeader title="New Product" />
      <ProductForm courses={await getCourses()} /> 
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
import { SkeletonButton } from "@/components/Skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { CourseLessonTable, CourseSectionTable, ProductTable, UserCourseAccessTable } from "@/drizzle/schema";
import { getCourseIdTag } from "@/features/courses/db/cache/courses";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache";
import { wherePublicCourseSections } from "@/features/courseSections/permissions/section";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons";
import { wherePublicLesson } from "@/features/lessons/permissions/lessons";

import { getGlobalProductsTag, getProductIdTag } from "@/features/products/db/cache/products";
import { userOwnsProducts } from "@/features/products/db/product";
import { wherePublicProducts } from "@/features/products/permissions/products";
import { formatPlural, formatPrice } from "@/lib/formatter";
import { sumArray } from "@/lib/sumArray";
import { getUserCoupon } from "@/lib/userCountryHeaders";
import { getCurrentUser } from "@/services/clerk";

import { and, asc, eq } from "drizzle-orm";
import { VideoIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";


const page = async ({ params }
    : { params: Promise<{ productId: string }> }) => {
    const { productId } = await params;

    const product = await getPublicProduct(productId);

    if (product == null) return notFound();
    const courseCount = product.courses.length;
    const lessonCount = sumArray(product.courses, course => sumArray(course.courseSections, s => s.lessons.length))

    return (
        <div className="container my-6">
            <div className="flex flex-col gap-16 items-center justify-between py-2 md:flex-row">
                <div className="flex gap-6 flex-col items-start">
                    <div className="flex flex-col gap-2" >
                        <Suspense
                            fallback={
                                <div className="text-xl">
                                    {formatPrice(product.price)}
                                </div>
                            } >
                            <Price price={product.price} />
                        </Suspense>
                        <h1 className="text-4xl font-semibold">{product.name}</h1>
                        <div className="text-muted-foreground">
                            {formatPlural(courseCount, { singular: "course", plural: "courses   " })}
                            {" "} • {" "}
                            {formatPlural(lessonCount, { singular: "lesson", plural: "lessons" })}
                        </div>
                    </div>
                    <div className="block relative aspect-video w-lg flex-grow md:hidden">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-xl" />
                </div>
                    <div className="text-xl">{product.description}</div>
                    <Suspense fallback={<SkeletonButton />} >
                        <PurchaseButton productId={product.id} />
                    </Suspense>
                </div>
                <div className="hidden relative aspect-video max-w-lg flex-grow md:block">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {product.courses.map(course =>
                    <Card key={course.id}>
                        <CardHeader>
                            <CardTitle>{course.name}</CardTitle>
                            <CardDescription>
                                {formatPlural(course.courseSections.length,
                                    { singular: "section", plural: "sections" })}
                                {" "} • {" "}
                                {formatPlural(sumArray(course.courseSections, s => s.lessons.length),
                                    { singular: "lesson", plural: "lessons" })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="multiple">
                                {course.courseSections.map(section => (
                                    <AccordionItem key={section.id} value={section.id}>
                                        <AccordionTrigger className="flex gap-2">
                                            <div className="flex flex-col flex-grow">
                                                <span>{section.name}</span>
                                                <span className="text-muted-foreground">
                                                    {formatPlural(section.lessons.length,
                                                        { singular: "lesson", plural: "lessons" })
                                                    }
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-2">
                                            {section.lessons.map(lesson => (
                                                <div key={lesson.id} className="flex items-center  gap-2 text-base">
                                                    <VideoIcon className="size-4" />
                                                    {lesson.status === "preview"
                                                        ? (<Link 
                                                        href={`/courses/${course.id}/lessons/${lesson.id}`}
                                                        className="underline text-accent"   >
                                                            {lesson.name}
                                                        </Link>
                                                        )
                                                        : lesson.name
                                                    }
                                                </div>
                                            ))
                                            }
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default page;

async function PurchaseButton({ productId }: { productId: string }) {
    const { userId } = await getCurrentUser()
    
    const alreadyOwnsProduct = userId != null && (await userOwnsProducts(userId, productId));
   
    console.log(alreadyOwnsProduct)
    if (alreadyOwnsProduct) {
        return <p>You already own this product</p>
    }

    return <Button className="text-xl h-auto py-4 px-8 rounded-lg" asChild>
        <Link href={`/products/${productId}/purchase`}>Get Now</Link>
    </Button>
}

async function Price({ price }: { price: number }) {
    const coupon = await getUserCoupon()
    if (price == 0 || coupon == null) return <div>{formatPrice(price)}</div>


    return (
        <div className="flex  gap-2 items-baseline">
            <div className="line-through text-sm opacity-50" >
                {formatPrice(price)}
            </div>
            <div className="text-xl">
                {formatPrice(price * (1 - coupon.discountPercentage))}
            </div>
        </div>)
}


async function getPublicProduct(productId: string) {
    "use cache";
    cacheTag(getProductIdTag(productId), getGlobalProductsTag());

    const products = await db.query.ProductTable.findFirst({
        columns: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true
        },
        where: and(eq(ProductTable.id, productId), wherePublicProducts),
        with: {
            product: {
                columns: {},
                with: {
                    courses: {
                        columns: {
                            id: true,
                            name: true,
                        },
                        with: {
                            courseSections: {
                                columns: {
                                    id: true,
                                    name: true
                                },
                                where: wherePublicCourseSections,
                                orderBy: asc(CourseSectionTable.order),
                                with: {
                                    lessons: {
                                        columns: {
                                            id: true,
                                            name: true,
                                            status: true,
                                        },
                                        where: wherePublicLesson,
                                        orderBy: asc(CourseLessonTable.order)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (products == null) return products;

    cacheTag(...products.product.flatMap(cp => [
        getLessonCourseTag(cp.courses.id),
        getCourseSectionCourseTag(cp.courses.id),
        getCourseIdTag(cp.courses.id),
    ]))

    const { product, ...others } = products;
    return {
        ...others,
        courses: product.map(cp => cp.courses)
    }
}



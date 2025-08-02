import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/formatter"
import { getUserCoupon } from "@/lib/userCountryHeaders"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"


const ProductCard = ({
    id, name, description, imageUrl, price
}
    : {

        id: string,
        name: string,
        description: string,
        price: number,
        imageUrl: string

    }) => {
    return (
        <Card
            className="overflow-hidden flex flex-col w-full max-w-[500px] mx-auto py-0 pb-6"
        >
            <div className="relative aspect-video w-full">
                <Image 
                src={imageUrl} 
                alt={name} fill className="object-cover" />
            </div>
            <CardHeader className="space-y-0">
                <CardDescription>
                    <Suspense fallback={formatPrice(price)}>
                        <Price price={price} />
                    </Suspense>
                </CardDescription>
                <CardTitle className="text-xl">{name}</CardTitle>

            </CardHeader>
            <CardContent>
                <p className="line-clamp-3">{description}</p>
            </CardContent>
            <CardFooter className="mt-auto">
                <Button className="w-full text-md py-6" asChild>
                    <Link href={`/products/${id}`}>View Course</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ProductCard;

export async function Price({ price }: { price: number }) {
    const coupon = await getUserCoupon()
    if (price == 0 || coupon == null) return formatPrice(price)


    return <div className="flex  gap-2 items-baseline">
        <div className="line-through text-xs opacity-50" >
            {formatPrice(price)}
        </div>

        <div>
            {formatPrice(price * (1 - coupon.discountPercentage))}
        </div>

    </div>
}
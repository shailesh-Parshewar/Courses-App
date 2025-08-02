import LoadingSpinner from '@/components/LoadingSpinner';

import PageHeader from '@/components/PageHeader';
import { db } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { getProductIdTag } from '@/features/products/db/cache/products';
import { userOwnsProducts } from '@/features/products/db/product';
import { getCurrentUser } from '@/services/clerk';
import StripeCheckoutForm from '@/services/stripe/components/StripeCheckoutForm';
import { SignIn, SignUp } from '@clerk/nextjs';

import { and, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound, redirect } from 'next/navigation';
import React, { Suspense } from 'react'

const PurchasePage = (
    {
        params,
        searchParams
    }
        : {
            params: Promise<{ productId: string }>,
            searchParams: Promise<{ authMode: string }>
        }) => {
    return (
        <Suspense fallback={<LoadingSpinner className="my-6 size-36 mx-auto" />}>

            <SuspendedComponent
                params={params}
                searchParams={searchParams}
            />
        </Suspense>
    )
}

export default PurchasePage;

async function SuspendedComponent({
    params,
    searchParams
}
    : {
        params: Promise<{ productId: string }>,
        searchParams: Promise<{ authMode: string }>
    }) {
    const { productId } = await params;
    

    const { user, clerkUserId} = await getCurrentUser({ allData: true })
    console.warn("ClerkId: " , clerkUserId)

    const product = await getPublicProduct(productId);
 

    if (product == null) return notFound();

    if (user != null) {
        if (await userOwnsProducts(user.id, product.id)) {
          
            redirect(`/courses`)
        } else {
           
            return (
                <div className='container my-6'>
                    <StripeCheckoutForm product={product} user={user} />
                </div>
            )
        }
    }

    const { authMode } = await searchParams;
    const isSignUp = authMode === "signUp";

    return <div className='container my-6 flex flex-col items-center'>
        <PageHeader title="You need an account to make a purchase" />
        {isSignUp ?
            (
                <SignUp
                    routing='hash'
                    signInUrl={`/products/${productId}/purchase?authMode=signIn`}
                    forceRedirectUrl={`/products/${productId}/purchase`}
                />
                
            )
            : (
                <SignIn
                    routing='hash'
                    signUpUrl={`/products/${productId}/purchase?authMode=signUp`}
                    forceRedirectUrl={`/products/${productId}/purchase`}
                />
            )
        }
    </div>
};

async function getPublicProduct(productId: string) {
    "use cache";
    cacheTag(getProductIdTag(productId))
    return db.query.ProductTable.findFirst({
        where: and(eq(ProductTable.id, productId), eq(ProductTable.status, "public")),
        columns: { id: true, name: true, imageUrl: true, description: true, price: true }
    })
}
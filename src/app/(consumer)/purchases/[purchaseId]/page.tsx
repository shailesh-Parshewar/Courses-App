import LoadingSpinner from '@/components/LoadingSpinner'
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { getPurchaseIdTag } from '@/features/purchase/db/cache/purchase';
import { formatDate, formatPrice } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/services/clerk';
import { stripeServerClient } from '@/services/stripe/stripeServer';
import { and, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Fragment, Suspense } from 'react'
import Stripe from 'stripe';

const PurchasePage = async ({ params }: { params: Promise<{ purchaseId: string }> }) => {
    const { purchaseId } = await params;
    return (
        <div className='container my-6'>
            <Suspense fallback={<LoadingSpinner className='size-36 mx-auto' />}>
                <SuspenseBoundary purchaseId={purchaseId} />
            </Suspense>
        </div>
    )
}

export default PurchasePage;


async function SuspenseBoundary({ purchaseId }: { purchaseId: string }) {
    const { userId, user, redirectToSignIn } = await getCurrentUser({ allData: true });

    if (userId == null || user == null) return redirectToSignIn();

    const purchase = await getPurchase({ userId, purchaseId });
    if (purchase == null) return notFound();

    const { receiptUrl, pricingRows } = await getStripeDetails(
        purchase.stripeSessionId,
        purchase.pricePaid,
        purchase.refundedAt != null
    )

    return (
        <>
            <PageHeader title={purchase.productDetails.name} />
            {receiptUrl && (
                <Button variant={"outline"} asChild className='mb-8'>
                    <Link target='_blank' href={receiptUrl}>View Reciept</Link>
                </Button>
            )}
            <Card>
                <CardHeader className='pb-4'>
                    <div className='flex justify-between items-start gap-4'>
                        <div className='flex flex-col gap-1'>
                            <CardTitle>Receipt</CardTitle>
                            <CardDescription>ID : {purchaseId}</CardDescription>
                        </div>
                        <Badge className='text-base'>{purchase.refundedAt ? "Refunded" : "Paid"}</Badge>

                    </div>
                </CardHeader>
                <CardContent className='pb-4 grid grid-cols-2 gap-8 border-t pt-4'>
                    <div>
                        <label className='text-muted-foreground text-sm'>Date</label>
                        <span className="block">{formatDate(purchase.createdAt)}</span>
                    </div>
                    <div>
                        <label className='text-muted-foreground text-sm'>Product</label>
                        <span className="block">{purchase.productDetails.name}</span>
                    </div>
                    <div>
                        <label className='text-muted-foreground text-sm'>Customer</label>
                        <span className="block">{user.name}</span>
                    </div>
                    <div>
                        <label className='text-muted-foreground text-sm'>Seller</label>
                        <span className="block">Web-Dev made easy</span>
                    </div>
                </CardContent>
                <CardFooter className='grid grid-cols-2 gap-y-4 gap-x-8 border-t pt-4'>
                    {pricingRows.map(({ label, amount, isBold }) => (
                        <Fragment key={label}>
                            <div className={cn(isBold && "font-bold")}>{label}</div>
                            <div className={cn("justify-self-end", isBold && "font-bold")}>{formatPrice(amount, { showZero : true})}</div>
                        </Fragment>
                    ))}
                </CardFooter>
            </Card>
        </>
    )
}

async function getPurchase({ userId, purchaseId }: { userId: string, purchaseId: string }) {
    "use cache";
    cacheTag(getPurchaseIdTag(purchaseId));

    return db.query.PurchaseTable.findFirst({
        where: and(eq(PurchaseTable.userId, userId), eq(PurchaseTable.id, purchaseId)),
        columns: {
            refundedAt: true,
            pricePaid: true,
            productDetails: true,
            stripeSessionId: true,
            createdAt: true,
        }
    })
}

async function getStripeDetails(sessionId: string, pricePaid: number, isRefunded: boolean) {
    const { payment_intent, total_details, amount_total, amount_subtotal } = await stripeServerClient.checkout.sessions.retrieve(sessionId, {
        expand: [
            "payment_intent.latest_charge",
            "total_details.breakdown.discounts",
        ]
    })

    const refundedAmount = typeof payment_intent != "string"
        && typeof payment_intent?.latest_charge != "string"
        ? payment_intent?.latest_charge?.amount_refunded
        : isRefunded
            ? pricePaid
            : undefined;

    return {
        receiptUrl: getRecieptUrl(payment_intent),
        pricingRows: getPricingRows(total_details, {
            total: (amount_total ?? pricePaid) - (refundedAmount ?? 0),
            subTotal: amount_subtotal ?? pricePaid,
            refund: refundedAmount,
        })
    }
};

function getRecieptUrl(paymentIntent: Stripe.PaymentIntent | string | null) {
    if (
        typeof paymentIntent == "string" ||
        typeof paymentIntent?.latest_charge == "string"
    ) {
        return
    }
    return paymentIntent?.latest_charge?.receipt_url;

}
function getPricingRows(
    total_details: Stripe.Checkout.Session.TotalDetails | null,
    {
        total,
        subTotal,
        refund,
    }: {
        total: number,
        subTotal: number,
        refund: number | undefined
    }) {
    const pricingRows: {
        label: string,
        amount: number,
        isBold?: boolean
    }[] = [];

    if (total_details?.breakdown != null) {
        total_details.breakdown.discounts.forEach(discount => pricingRows.push({
            label: `${discount.discount.coupon.name} (${discount.discount.coupon.percent_off}% off)`,
            amount: discount.amount / -100
        }))
    }

    if (refund) pricingRows.push({ label: "refund", amount: refund / -100 });

    if (pricingRows.length === 0) return [{ label: "Total", amount: total / 100, isBold: true }];

    return [
        { label: "subtotal", amount: subTotal / 100 }
        , ...pricingRows
        , { label: "Total", amount: total / 100 }
    ];
}
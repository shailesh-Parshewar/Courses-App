
import { env } from "@/data/env/server";
import { db } from "@/drizzle/db";
import { ProductTable, UsersTable } from "@/drizzle/schema";
import { insertUserCourseAccess } from "@/features/courses/db/userCourseAccess";
import { insertPurchase } from "@/features/purchase/db/purchase";

import { stripeServerClient } from "@/services/stripe/stripeServer";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import Stripe from "stripe";

export async function GET(request : NextRequest) {
    const stripeSessionId = request.nextUrl.searchParams.get("stripeSessionId")
    if(stripeSessionId == null) redirect("/products/purchase-failure")
        
let redirectUrl : string;
    try {
        const checkoutSession = await stripeServerClient.checkout.sessions.retrieve(stripeSessionId,
             { expand: ["line_items"]})

             const productId = await processStripeCheckout(checkoutSession);

             redirectUrl = `/products/${productId}/purchase/success`
    } catch (e) {
        redirectUrl = `/products/purchase-failure`
    }

   redirect(redirectUrl);
}

export async function POST(request : NextRequest) {
const event = await stripeServerClient.webhooks.constructEvent(
    await request.text(), 
    request.headers.get("stripe-signature") as string,
env.STRIPE_WEBHOOK_SECRET
)

    switch(event.type) {
        case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded" : {
                try{
                    await processStripeCheckout(event.data.object)
                } catch {
                    return new Response(null, { status : 500 })
                }
            }
    }
    return new Response(null, {status: 200})
}

async function processStripeCheckout(checkoutSession : Stripe.Checkout.Session) {
    const userId = checkoutSession.metadata?.userId;
    const productId = checkoutSession.metadata?.productId;

    if(userId == null || productId == null) {
throw new Error("Missing metadata")
    }

    const [product, user] = await Promise.all([
     getProduct(productId), getUser(userId)
    ])

    if(product == null) throw new Error("Product not found");
    if(user == null) throw new Error("User not found");

    const courseIds = product.product.map(cp => cp.courseId);
    db.transaction(async trx => {
  try {
    insertUserCourseAccess({userId: user.id, courseIds }, trx)
    insertPurchase({
        stripeSessionId : checkoutSession.id,
        pricePaid : checkoutSession.amount_total || product.price * 100,
        userId : user.id,
        productId : product.id,
        productDetails: product,
    }, trx)
} catch(error) {
    trx.rollback()
    throw error;
}
})
        

    return product.id
}

 function getProduct(productId : string) {
return  db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
    columns : {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        description: true,
    },
    with: {
     product : {columns : { courseId: true}}
    }
    
})
}

 function getUser(userId : string) {
    return  db.query.UsersTable.findFirst({
        where : eq(UsersTable.id, userId),
        columns : {id : true,}
    })
}
"use server";

import { getCurrentUser } from "@/services/clerk";
import { canRefundPurchases } from "../permissions/purchases";
import { stripeServerClient } from "@/services/stripe/stripeServer";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { PurchaseTable } from "@/drizzle/schema";
import { updatePurchase } from "../db/purchase";
import { revokeUserCourseAccess } from "@/features/courses/db/userCourseAccess";


export async function refundPurchase(purchaseId: string) {
if(!canRefundPurchases(await getCurrentUser())) {
    return { error : true, message : "there was an error refunding this purchase."}
}

 const data = await db.transaction(async trx => {
    const refundedPurchase = await updatePurchase(purchaseId, { refundedAt : new Date()} ,trx)

    const session = await stripeServerClient.checkout.sessions.retrieve(refundedPurchase.stripeSessionId);

    if(session.payment_intent == null) {
        trx.rollback();
        return {error : true, message : "Failed to refund this purchase."}
    }

    try {
        await stripeServerClient.refunds.create({
            payment_intent: typeof session.payment_intent === "string" 
            ? session.payment_intent
            :  session.payment_intent.id
        })

        await revokeUserCourseAccess(refundedPurchase, trx);
    } catch(err) {
        trx.rollback()
         return {error : true, message : "Failed to refund this purchase."}
    }
})

return data ?? {error : false, message : "Successfully refunded purchase."};
}


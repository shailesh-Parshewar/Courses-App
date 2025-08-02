"use client"

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { stripeClientPromise } from "../stripeClient"
import { getClientSessionsSecret } from "../actions/stripe"

const StripeCheckoutForm = ({
    user,
    product
}:
    {
        product: {
            price: number,
            id: string,
            name: string,
            description: string,
            imageUrl: string,
        }, user: {
            email: string,
            id: string
        }
    }) => {
console.log
    return (
        <EmbeddedCheckoutProvider stripe={stripeClientPromise}
            options={
                {
                    fetchClientSecret: getClientSessionsSecret.bind(null, product, user)
                }
            } >
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    )
}

export default StripeCheckoutForm
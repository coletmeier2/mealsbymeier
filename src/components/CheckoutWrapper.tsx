"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "./CheckoutForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Props {
  productId: string
  productSlug: string
}

export default function CheckoutWrapper({ productId, productSlug }: Props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm productId={productId} productSlug={productSlug} />
    </Elements>
  )
}

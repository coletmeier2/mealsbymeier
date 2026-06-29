"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

interface Props {
  productId: string
  productSlug: string
}

export default function CheckoutForm({ productId, productSlug }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [fulfillmentType, setFulfillmentType] = useState<"PICKUP" | "DELIVERY">("PICKUP")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError("")

    // Step 1: Create PaymentIntent server-side — price comes from DB, not this form
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        fulfillmentType,
        deliveryAddress: fulfillmentType === "DELIVERY" ? deliveryAddress : "",
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong. Please try again.")
      setSubmitting(false)
      return
    }

    const { clientSecret } = await res.json()

    // Step 2: Confirm card payment — card data goes directly to Stripe, never our server
    const card = elements.getElement(CardElement)
    if (!card) {
      setError("Card input not found. Please refresh and try again.")
      setSubmitting(false)
      return
    }

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    })

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed.")
      setSubmitting(false)
      return
    }

    router.push(`/shop/${productSlug}/success`)
  }

  const inputClass =
    "w-full border border-gold/20 bg-transparent text-ivory placeholder:text-muted text-sm px-3 py-2 focus:outline-none focus:border-gold/60 transition-colors"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">

      <div className="w-full h-px bg-gold/15" />
      <p className="font-sans text-xs tracking-widest uppercase text-gold">Your Details</p>

      <input
        required
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <input
        required
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <input
        required
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={inputClass}
      />

      <div className="flex gap-3">
        {(["PICKUP", "DELIVERY"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFulfillmentType(type)}
            className={`flex-1 py-2 text-xs tracking-widest uppercase font-sans border transition-colors ${
              fulfillmentType === type
                ? "border-gold text-gold"
                : "border-gold/20 text-muted hover:border-gold/40"
            }`}
          >
            {type === "PICKUP" ? "Pickup" : "Delivery"}
          </button>
        ))}
      </div>

      {fulfillmentType === "DELIVERY" && (
        <input
          required
          type="text"
          placeholder="Delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className={inputClass}
        />
      )}

      <div className="w-full h-px bg-gold/15" />
      <p className="font-sans text-xs tracking-widest uppercase text-gold">Payment</p>

      <div className="border border-gold/20 px-3 py-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#f5f0e8",
                fontFamily: "sans-serif",
                "::placeholder": { color: "#8a8070" },
              },
              invalid: { color: "#e57373" },
            },
          }}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !stripe}
        className="w-full font-sans text-xs tracking-widest uppercase border border-gold/40 text-ivory py-4 hover:bg-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Processing…" : "Place Order"}
      </button>

      <p className="text-xs text-muted text-center">
        Secured by Stripe — your card details never touch our server.
      </p>
    </form>
  )
}

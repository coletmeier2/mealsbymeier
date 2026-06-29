import Link from "next/link"

export const metadata = { title: "Order Confirmed | MealsByMeier" }

export default function OrderSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-24 text-center">
      <div className="mb-8 mx-auto w-12 h-px bg-gold/40" />

      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
        Order Received
      </p>
      <h1 className="font-display text-ivory text-5xl md:text-6xl tracking-wide mb-6">
        Thank you.
      </h1>
      <p className="font-sans text-ivory/70 text-sm leading-relaxed mb-2">
        Your payment was successful. I&apos;ll be in touch to coordinate pickup or delivery.
      </p>
      <p className="font-sans text-muted text-xs leading-relaxed mb-12">
        Check your email for a confirmation.
      </p>

      <div className="mb-8 mx-auto w-12 h-px bg-gold/40" />

      <Link
        href="/shop"
        className="font-sans text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors"
      >
        ← Back to Shop
      </Link>
    </div>
  )
}

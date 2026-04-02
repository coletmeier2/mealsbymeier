import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/modules/shop/queries"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const price = `$${(product.price / 100).toFixed(2)}`

  return (
    <div className="min-h-screen bg-brand">
      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* Back link */}
        <Link
          href="/shop"
          className="font-sans text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors"
        >
          ← Back to Shop
        </Link>

        <div className="mt-10 flex flex-col md:flex-row gap-12 items-start">

          {/* ── Image ── */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <div className="relative aspect-[3/4] w-full ring-1 ring-gold/50 ring-offset-[8px] ring-offset-brand overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* ── Details ── */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 md:pt-4">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">
                Baked to Order
              </p>
              <h1 className="font-display text-ivory text-4xl md:text-5xl leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="font-sans text-ivory/70 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="w-10 h-px bg-gold/40" />

            <div className="flex items-center justify-between">
              <p className="font-display text-gold text-3xl">{price}</p>
              <p className="font-sans text-muted text-xs tracking-wide">
                Includes the recipe
              </p>
            </div>

            <p className="font-sans text-muted text-xs leading-relaxed border border-gold/15 bg-surface px-4 py-3">
              Orders are fulfilled locally — pickup or delivery coordinated after purchase.
            </p>

            {/* Stripe checkout — Phase 2 */}
            <button
              disabled
              className="w-full font-sans text-xs tracking-widest uppercase border border-gold/20 text-muted py-4 cursor-not-allowed"
            >
              Order Now — Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

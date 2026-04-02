import Image from "next/image"
import Link from "next/link"
import { getFeaturedProducts } from "@/modules/shop/queries"

export const metadata = { title: "Shop | MealsByMeier" }

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function ShopPage() {
  const products = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-brand">

      {/* ── Page header ── */}
      <div className="max-w-5xl mx-auto px-8 pt-16 pb-12 text-center">
        <h1 className="font-display text-ivory text-5xl md:text-6xl tracking-wide">
          Baked Goods
        </h1>
        <p className="font-sans text-muted text-sm tracking-wide mt-4">
          Baked to order — each purchase includes the recipe.
        </p>
        <div className="mt-8 mx-auto w-32 h-px bg-gold/30" />
      </div>

      {/* ── Product list ── */}
      {products.length === 0 ? (
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <p className="font-sans text-muted text-sm tracking-widest uppercase">
            No items available right now — check back soon.
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-8 pb-24 flex flex-col gap-0">
          {products.map((product, i) => {
            const imageLeft = i % 2 === 0
            return (
              <div key={product.id}>
                <div
                  className={`flex flex-col ${
                    imageLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-0 md:gap-12 items-center py-16`}
                >
                  {/* ── Image ── */}
                  <div className="w-full md:w-1/2 flex-shrink-0">
                    <div className="relative aspect-[3/4] w-full ring-1 ring-gold/50 ring-offset-[8px] ring-offset-brand overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* ── Details card ── */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center pt-8 md:pt-0">
                    <div
                      className={`border border-gold/20 bg-ivory p-8 md:p-10 flex flex-col gap-5 ${
                        imageLeft ? "md:border-l-0" : "md:border-r-0"
                      }`}
                    >
                      <div>
                        <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">
                          Baked to Order
                        </p>
                        <h2 className="font-display text-brand text-3xl md:text-4xl leading-tight">
                          {product.name}
                        </h2>
                      </div>

                      <p className="font-sans text-brand/70 text-sm leading-relaxed">
                        {product.description}
                      </p>

                      <div className="w-10 h-px bg-gold/60" />

                      <div className="flex items-center justify-between">
                        <p className="font-display text-brand text-2xl">
                          {formatPrice(product.price)}
                        </p>
                        <p className="font-sans text-brand/50 text-xs tracking-wide">
                          Includes the recipe
                        </p>
                      </div>

                      <Link
                        href={`/shop/${product.slug}`}
                        className="mt-2 w-full text-center font-sans text-xs tracking-widest uppercase border border-brand/30 text-brand py-3 px-6 hover:bg-brand hover:text-ivory transition-colors duration-200"
                      >
                        Place an Order
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Section divider */}
                {i < products.length - 1 && (
                  <div className="w-full h-px bg-gold/10" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

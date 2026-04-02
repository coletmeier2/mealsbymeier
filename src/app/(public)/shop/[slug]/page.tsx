import Image from "next/image"
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square relative rounded-xl overflow-hidden bg-stone-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">{product.name}</h1>
          <p className="text-xl font-medium text-stone-700 mb-4">{price}</p>
          <p className="text-stone-600 mb-6">{product.description}</p>
          <p className="text-sm text-stone-500 mb-6">
            Baked to order. Includes the recipe upon purchase.
          </p>
          {/* Stripe checkout button — Phase 2 */}
          <button
            disabled
            className="w-full bg-stone-900 text-white py-3 rounded-full font-medium opacity-50 cursor-not-allowed"
          >
            Order Now (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  )
}

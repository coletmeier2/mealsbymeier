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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Baked Goods</h1>
        <p className="text-stone-500 mt-1 text-sm">
          Fresh, baked to order. Each purchase includes the recipe.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-stone-500">No items available right now. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative bg-stone-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="font-medium text-stone-900">{product.name}</h2>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-3 font-semibold text-stone-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

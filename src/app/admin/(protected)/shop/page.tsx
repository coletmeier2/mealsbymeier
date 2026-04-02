import Image from "next/image"
import { getAllProducts } from "@/modules/shop/queries"
import { toggleFeatured, deleteProduct } from "@/modules/shop/actions"

export const metadata = { title: "Shop | Admin" }

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AdminShopPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Shop</h1>
        {/* Add product form — Phase 2 */}
      </div>

      {products.length === 0 ? (
        <p className="text-stone-500">No products yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl p-4"
            >
              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900">{product.name}</p>
                <p className="text-sm text-stone-500">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <form
                  action={async () => {
                    "use server"
                    await toggleFeatured(product.id, !product.isFeatured)
                  }}
                >
                  <button
                    type="submit"
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      product.isFeatured
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {product.isFeatured ? "Featured" : "Set Featured"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server"
                    await deleteProduct(product.id)
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

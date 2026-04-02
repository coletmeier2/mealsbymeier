import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen bg-stone-50 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-semibold tracking-tight text-stone-900 mb-4">
          MealsByMeier
        </h1>
        <p className="text-lg text-stone-600 mb-10">
          Homemade recipes and fresh baked goods by Cole Meier.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/feed"
            className="px-6 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-700 transition-colors"
          >
            Browse Recipes
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-stone-900 text-stone-900 rounded-full font-medium hover:bg-stone-100 transition-colors"
          >
            Shop Baked Goods
          </Link>
        </div>
      </div>
    </main>
  )
}

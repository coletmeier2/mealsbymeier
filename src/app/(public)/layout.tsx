import Link from "next/link"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-stone-900 text-lg tracking-tight"
          >
            MealsByMeier
          </Link>
          <div className="flex gap-6 text-sm font-medium text-stone-600">
            <Link href="/feed" className="hover:text-stone-900 transition-colors">
              Feed
            </Link>
            <Link href="/shop" className="hover:text-stone-900 transition-colors">
              Shop
            </Link>
            <Link href="/about" className="hover:text-stone-900 transition-colors">
              About
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} MealsByMeier
      </footer>
    </div>
  )
}

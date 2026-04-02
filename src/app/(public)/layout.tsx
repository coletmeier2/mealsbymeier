import Link from "next/link"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-brand">
      <header className="w-full border-b border-gold/20">
        <nav className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-ivory text-2xl tracking-wide hover:text-gold transition-colors"
          >
            MealsByMeier
          </Link>
          <div className="flex gap-8">
            {[
              { href: "/shop",  label: "Shop"  },
              { href: "/about", label: "About" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-sans text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="w-full border-t border-gold/20 py-8 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-muted">
          © {new Date().getFullYear()} MealsByMeier
        </p>
      </footer>
    </div>
  )
}

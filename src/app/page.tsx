import Link from "next/link"
import { getRecentSitePosts, getPostsByCategory } from "@/modules/content/queries"
import { CATEGORIES } from "@/modules/content/categories"
import Slideshow from "@/components/Slideshow"
import StickyWordmark from "@/components/StickyWordmark"

export default async function HomePage() {
  const [recentPosts, ...categoryResults] = await Promise.all([
    getRecentSitePosts(10),
    ...CATEGORIES.map((cat) => getPostsByCategory(cat.slug)),
  ])

  return (
    <div className="bg-brand min-h-screen">
      <StickyWordmark />

      {/* ── NAV ── */}
      <header className="w-full pt-12 pb-10 px-8 text-center">
        <Link
          href="/"
          className="font-display text-ivory text-5xl md:text-7xl tracking-wide hover:text-gold transition-colors duration-300"
        >
          MealsByMeier
        </Link>
        <nav className="mt-5 flex justify-center gap-10">
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
        </nav>
        <p className="mt-4 font-display text-muted text-lg md:text-xl italic">
          "Anyone can cook" — Chef Gusteau
        </p>
        <div className="mt-8 mx-auto w-32 h-px bg-gold/30" />
      </header>

      {/* ── HERO SECTION ── */}
      <section className="w-full px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="font-sans text-xs tracking-widest uppercase text-gold">Latest</p>
            <h2 className="font-display text-ivory text-4xl md:text-5xl mt-2">
              Recently Made
            </h2>
            <div className="mt-4 w-12 h-px bg-gold/40" />
          </div>
          <Slideshow posts={recentPosts} />
        </div>
      </section>

      {/* ── CATEGORY SECTIONS ── */}
      {CATEGORIES.map((cat, i) => {
        const posts = categoryResults[i] ?? []
        return (
          <section key={cat.slug} className="w-full px-8 pb-24">
            <div className="max-w-5xl mx-auto">
              {/* Gold divider between sections */}
              <div className="mb-10 w-full h-px bg-gold/15" />
              <div className="mb-8">
                <p className="font-sans text-xs tracking-widest uppercase text-gold">
                  {cat.slug.replace("-", " ")}
                </p>
                <h2 className="font-display text-ivory text-4xl md:text-5xl mt-2">
                  {cat.label}
                </h2>
                <div className="mt-4 w-12 h-px bg-gold/40" />
              </div>
              <Slideshow posts={posts} />
            </div>
          </section>
        )
      })}

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-gold/20 py-10 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-muted">
          © {new Date().getFullYear()} MealsByMeier
        </p>
      </footer>
    </div>
  )
}

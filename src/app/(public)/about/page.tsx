export const metadata = { title: "About | MealsByMeier" }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-20">
      <div className="mb-10">
        <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">About</p>
        <h1 className="font-display text-ivory text-5xl md:text-6xl tracking-wide">
          Cole Meier
        </h1>
        <div className="mt-6 w-12 h-px bg-gold/40" />
      </div>

      <div className="flex flex-col gap-5 font-sans text-ivory/70 text-sm leading-relaxed">
        <p>
          Hi, I&apos;m Cole Meier — home cook, baker, and the person behind MealsByMeier.
        </p>
        <p>
          I share the meals and baked goods I make at home, and offer some of my
          favorite baked goods for order. Every purchase comes with the recipe so you
          can make it yourself too.
        </p>
        <p>
          Follow along on Instagram{" "}
          <a
            href="https://instagram.com/mealsbymeier"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-ivory transition-colors underline underline-offset-4"
          >
            @mealsbymeier
          </a>
          .
        </p>
      </div>
    </div>
  )
}

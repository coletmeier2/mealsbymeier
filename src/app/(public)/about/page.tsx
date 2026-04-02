export const metadata = { title: "About | MealsByMeier" }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-stone-900 mb-6">About</h1>
      <p className="text-stone-600 leading-relaxed mb-4">
        Hi, I&apos;m Cole Meier — home cook, baker, and the person behind MealsByMeier.
      </p>
      <p className="text-stone-600 leading-relaxed mb-4">
        I share the meals and baked goods I make at home, and offer some of my
        favorite baked goods for order. Every purchase comes with the recipe so you
        can make it yourself too.
      </p>
      <p className="text-stone-600 leading-relaxed">
        Follow along on Instagram{" "}
        <a
          href="https://instagram.com/mealsbymeier"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-900 font-medium underline underline-offset-2"
        >
          @mealsbymeier
        </a>
        .
      </p>
    </div>
  )
}

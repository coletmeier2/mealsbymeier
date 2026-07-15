import { notFound } from "next/navigation"
import { getRecipeByToken } from "@/modules/recipes/queries"
import RecipeContent from "@/components/RecipeContent"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const access = await getRecipeByToken(token)
  return {
    title: access ? `${access.recipe.title} | MealsByMeier` : "Recipe | MealsByMeier",
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const access = await getRecipeByToken(token)

  if (!access) notFound()

  const { recipe } = access

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">
          Recipe
        </p>
        <h1 className="font-display text-ivory text-4xl md:text-5xl leading-tight mb-6">
          {recipe.title}
        </h1>
        <div className="w-10 h-px bg-gold/40" />
      </div>

      {/* Content */}
      <RecipeContent content={recipe.content} />

      {/* Footer note */}
      <div className="mt-16 pt-8 border-t border-gold/20">
        <p className="font-sans text-xs text-muted text-center tracking-wide">
          This recipe is personal to your order — please don&apos;t share the link.
        </p>
      </div>

    </div>
  )
}

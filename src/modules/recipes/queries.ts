import { cache } from "react"
import { db } from "@/lib/db"

export const getRecipeByToken = cache(async (token: string) => {
  return db.recipeAccess.findUnique({
    where: { accessToken: token },
    include: {
      recipe: true,
    },
  })
})

export async function getAllRecipes() {
  return db.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  })
}

export async function getRecipeById(id: string) {
  return db.recipe.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  })
}

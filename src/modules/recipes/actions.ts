"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createRecipe(formData: FormData): Promise<void> {
  const session = await auth()
  if (!session) redirect("/admin/login")

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const productId = (formData.get("productId") as string) || null

  if (!title || !content) throw new Error("Title and content are required")

  await db.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: { title, content },
    })

    if (productId) {
      // Clear any other product that may already point to this new recipe (defensive),
      // then link the selected product — mirrors updateRecipe's unlink-then-relink pattern
      await tx.product.updateMany({
        where: { recipeId: recipe.id },
        data: { recipeId: null },
      })
      await tx.product.update({
        where: { id: productId },
        data: { recipeId: recipe.id },
      })
    }
  })

  revalidatePath("/admin/recipes")
  redirect("/admin/recipes")
}

export async function updateRecipe(id: string, formData: FormData): Promise<void> {
  const session = await auth()
  if (!session) redirect("/admin/login")

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const productId = (formData.get("productId") as string) || null

  if (!title || !content) throw new Error("Title and content are required")

  await db.$transaction(async (tx) => {
    await tx.recipe.update({
      where: { id },
      data: { title, content },
    })

    // Unlink any product currently pointing to this recipe, then re-link if selected
    await tx.product.updateMany({
      where: { recipeId: id },
      data: { recipeId: null },
    })

    if (productId) {
      await tx.product.update({
        where: { id: productId },
        data: { recipeId: id },
      })
    }
  })

  revalidatePath("/admin/recipes")
  redirect("/admin/recipes")
}

export async function deleteRecipe(id: string): Promise<void> {
  const session = await auth()
  if (!session) redirect("/admin/login")

  await db.$transaction(async (tx) => {
    const accessCount = await tx.recipeAccess.count({ where: { recipeId: id } })
    if (accessCount > 0) {
      throw new Error("Cannot delete a recipe that customers have purchased access to.")
    }

    await tx.product.updateMany({
      where: { recipeId: id },
      data: { recipeId: null },
    })
    await tx.recipe.delete({ where: { id } })
  }, { isolationLevel: "Serializable" })

  revalidatePath("/admin/recipes")
}

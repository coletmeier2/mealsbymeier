"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { CreateProductInput } from "./types"

export async function createProduct(input: CreateProductInput) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await db.product.create({ data: input })

  revalidatePath("/shop")
  revalidatePath("/admin/shop")
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await db.product.update({ where: { id }, data: input })

  revalidatePath("/shop")
  revalidatePath("/admin/shop")
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await db.product.update({ where: { id }, data: { isFeatured } })

  revalidatePath("/shop")
  revalidatePath("/admin/shop")
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await db.product.delete({ where: { id } })

  revalidatePath("/shop")
  revalidatePath("/admin/shop")
}

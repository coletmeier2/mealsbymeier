"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { PublishTarget } from "./types"

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const imageUrl = formData.get("imageUrl") as string
  const caption = formData.get("caption") as string
  const publishTarget = formData.get("publishTarget") as PublishTarget
  const category = (formData.get("category") as string) || null

  if (!imageUrl || !caption) throw new Error("imageUrl and caption are required")

  const publishedToSite = publishTarget === "site" || publishTarget === "both"
  const publishedToInstagram = publishTarget === "instagram" || publishTarget === "both"

  await db.post.create({
    data: { imageUrl, caption, category, publishedToSite, publishedToInstagram },
  })

  revalidatePath("/")
  revalidatePath("/admin/posts")
}

export async function deletePost(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await db.post.delete({ where: { id } })

  revalidatePath("/feed")
  revalidatePath("/admin/posts")
}

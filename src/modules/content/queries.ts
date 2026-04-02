import { db } from "@/lib/db"

export async function getPublishedPosts() {
  return db.post.findMany({
    where: { publishedToSite: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getPostById(id: string) {
  return db.post.findUnique({ where: { id } })
}

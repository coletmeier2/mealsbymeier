import { db } from "@/lib/db"

export async function getPublishedPosts() {
  return db.post.findMany({
    where: { publishedToSite: true },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  })
}

export async function getAllPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  })
}

export async function getPostById(id: string) {
  return db.post.findUnique({
    where: { id },
    include: { product: true },
  })
}

export async function getRecentSitePosts(limit = 10) {
  return db.post.findMany({
    where: { publishedToSite: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { product: true },
  })
}

export async function getPostsByCategory(category: string) {
  return db.post.findMany({
    where: { publishedToSite: true, category },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  })
}

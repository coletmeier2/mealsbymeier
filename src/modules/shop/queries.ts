import { db } from "@/lib/db"

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllProducts() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: { recipe: true },
  })
}

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    include: { recipe: true },
  })
}

import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"

export const getFeaturedProducts = unstable_cache(
  async () =>
    db.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    }),
  ["featured-products"],
  { tags: ["featured-products"] }
)

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

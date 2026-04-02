import { db } from "@/lib/db"

export async function getAllOrders() {
  return db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  })
}

export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
      recipeAccess: true,
    },
  })
}

export async function getOrdersByStatus(status: string) {
  return db.order.findMany({
    where: { status: status as never },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  })
}

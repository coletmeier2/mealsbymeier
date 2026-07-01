"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { OrderStatus } from "./types"

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING:   ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["READY", "CANCELLED"],
  READY:     ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const session = await auth()
  if (!session) redirect("/admin/login")

  const order = await db.order.findUnique({ where: { id: orderId }, select: { status: true } })
  if (!order) throw new Error("Order not found")

  if (!VALID_TRANSITIONS[order.status].includes(status)) {
    throw new Error(`Invalid transition: ${order.status} → ${status}`)
  }

  await db.order.update({ where: { id: orderId }, data: { status } })
  revalidatePath("/admin/orders")
}

import { getResend } from "@/lib/resend"
import { orderConfirmationHtml } from "./templates/orderConfirmation"
import type { OrderWithItems } from "@/modules/orders/types"

export async function sendOrderConfirmationEmail(order: OrderWithItems, recipeUrl?: string, recipePdfUrl?: string): Promise<void> {
  const from = process.env.FROM_EMAIL
  if (!from) throw new Error("FROM_EMAIL is not set")

  await getResend().emails.send({
    from,
    to: order.customerEmail,
    subject: "Order Confirmed — MealsByMeier",
    html: orderConfirmationHtml(order, recipeUrl, recipePdfUrl),
  })
}

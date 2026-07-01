import { getTwilio } from "@/lib/twilio"
import type { OrderWithItems } from "@/modules/orders/types"

export async function sendOrderSmsAlert(order: OrderWithItems): Promise<void> {
  const from = process.env.TWILIO_PHONE_NUMBER
  const to = process.env.ADMIN_PHONE_NUMBER
  if (!from || !to) throw new Error("TWILIO_PHONE_NUMBER or ADMIN_PHONE_NUMBER is not set")

  // Trial accounts require this predefined template; swap for a custom body on a paid account
  await getTwilio().messages.create({
    from,
    to,
    body: "sms_order_confirmation",
  })
}

import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { sendOrderConfirmationEmail } from "@/modules/notifications/email"
import { sendOrderSmsAlert } from "@/modules/notifications/sms"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  // Raw bytes required — signature verification fails if the body is parsed first
  const rawBody = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object
    const meta = intent.metadata

    // Idempotency — webhook can fire more than once for the same payment
    const existing = await db.order.findUnique({
      where: { stripePaymentIntentId: intent.id },
    })
    if (existing) {
      return NextResponse.json({ received: true })
    }

    const product = await db.product.findUnique({ where: { id: meta.productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 })
    }

    const fulfillmentType = meta.fulfillmentType
    if (fulfillmentType !== "PICKUP" && fulfillmentType !== "DELIVERY") {
      return NextResponse.json({ error: "Invalid fulfillment type in metadata" }, { status: 400 })
    }

    let order
    try {
      order = await db.order.create({
        data: {
          customerName: meta.customerName,
          customerEmail: meta.customerEmail,
          customerPhone: meta.customerPhone,
          fulfillmentType,
          deliveryAddress: meta.deliveryAddress || null,
          status: "PENDING",
          stripePaymentIntentId: intent.id,
          totalAmount: intent.amount,
          items: {
            create: {
              productId: product.id,
              quantity: 1,
              priceAtTime: product.price,
            },
          },
        },
        include: {
          items: { include: { product: true } },
        },
      })
    } catch {
      return NextResponse.json({ error: "Failed to create order" }, { status: 400 })
    }

    try {
      await sendOrderConfirmationEmail(order)
    } catch (err) {
      console.error("Failed to send order confirmation email:", err)
    }

    try {
      await sendOrderSmsAlert(order)
    } catch (err) {
      console.error("Failed to send order SMS alert:", err)
    }
  }

  // Return 200 for all event types — tells Stripe to stop retrying
  return NextResponse.json({ received: true })
}

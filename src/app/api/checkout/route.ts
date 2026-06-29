import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { getProductById } from "@/modules/shop/queries"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { productId, customerName, customerEmail, customerPhone, fulfillmentType, deliveryAddress } = body

  if (!productId || !customerName || !customerEmail || !customerPhone || !fulfillmentType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (!["PICKUP", "DELIVERY"].includes(fulfillmentType)) {
    return NextResponse.json({ error: "Invalid fulfillment type" }, { status: 400 })
  }

  // Price is always read from the DB — the client never sends an amount
  const product = await getProductById(productId)
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: product.price,
    currency: "usd",
    metadata: {
      productId: product.id,
      productName: product.name,
      customerName,
      customerEmail,
      customerPhone,
      fulfillmentType,
      deliveryAddress: deliveryAddress ?? "",
    },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}

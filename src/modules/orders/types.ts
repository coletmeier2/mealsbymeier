export type OrderStatus = "PENDING" | "CONFIRMED" | "READY" | "COMPLETED" | "CANCELLED"
export type FulfillmentType = "PICKUP" | "DELIVERY"

export interface OrderWithItems {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillmentType: FulfillmentType
  deliveryAddress: string | null
  status: OrderStatus
  totalAmount: number // cents
  createdAt: Date
  items: {
    id: string
    quantity: number
    priceAtTime: number
    product: {
      id: string
      name: string
      imageUrl: string
    }
  }[]
}

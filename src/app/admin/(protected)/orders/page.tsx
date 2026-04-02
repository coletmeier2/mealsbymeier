import { getAllOrders } from "@/modules/orders/queries"

export const metadata = { title: "Orders | Admin" }

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  READY: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-stone-50 text-stone-500 border-stone-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-stone-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-stone-900">{order.customerName}</p>
                  <p className="text-sm text-stone-500">{order.customerEmail}</p>
                  <p className="text-sm text-stone-500">{order.customerPhone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${statusColors[order.status] ?? ""}`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm font-medium text-stone-900 mt-2">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-2">
                  {order.fulfillmentType === "PICKUP" ? "Pickup" : "Delivery"}
                  {order.deliveryAddress ? ` — ${order.deliveryAddress}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-0.5 text-stone-700"
                    >
                      {item.quantity}× {item.product.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status update actions — Phase 2 (Stripe integration) */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

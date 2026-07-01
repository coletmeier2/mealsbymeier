import { getAllOrders } from "@/modules/orders/queries"
import { updateOrderStatus } from "@/modules/orders/actions"
import type { OrderStatus } from "@/modules/orders/types"

export const metadata = { title: "Orders | Admin" }

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  READY: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-stone-50 text-stone-500 border-stone-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
}

const TRANSITIONS: Record<OrderStatus, { label: string; next: OrderStatus; style: string }[]> = {
  PENDING:   [
    { label: "Confirm",  next: "CONFIRMED", style: "border-blue-300 text-blue-700 hover:bg-blue-50" },
    { label: "Cancel",   next: "CANCELLED", style: "border-red-300 text-red-600 hover:bg-red-50" },
  ],
  CONFIRMED: [
    { label: "Mark Ready", next: "READY",     style: "border-green-300 text-green-700 hover:bg-green-50" },
    { label: "Cancel",     next: "CANCELLED", style: "border-red-300 text-red-600 hover:bg-red-50" },
  ],
  READY:     [
    { label: "Complete", next: "COMPLETED", style: "border-stone-300 text-stone-600 hover:bg-stone-50" },
  ],
  COMPLETED: [],
  CANCELLED: [],
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

const TERMINAL: OrderStatus[] = ["COMPLETED", "CANCELLED"]

function OrderCard({ order }: { order: Awaited<ReturnType<typeof getAllOrders>>[number] }) {
  const isTerminal = TERMINAL.includes(order.status as OrderStatus)
  return (
    <div className={`bg-white border rounded-xl p-5 ${isTerminal ? "border-stone-100 opacity-60" : "border-stone-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-medium ${isTerminal ? "text-stone-500" : "text-stone-900"}`}>{order.customerName}</p>
          <p className="text-sm text-stone-500">{order.customerEmail}</p>
          <p className="text-sm text-stone-500">{order.customerPhone}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[order.status] ?? ""}`}>
            {order.status}
          </span>
          <p className={`text-sm font-medium mt-2 ${isTerminal ? "text-stone-500" : "text-stone-900"}`}>
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

      {TRANSITIONS[order.status as OrderStatus].length > 0 && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex gap-2">
          {TRANSITIONS[order.status as OrderStatus].map(({ label, next, style }) => (
            <form
              key={next}
              action={async () => {
                "use server"
                await updateOrderStatus(order.id, next)
              }}
            >
              <button
                type="submit"
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${style}`}
              >
                {label}
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  const active = orders.filter((o) => !TERMINAL.includes(o.status as OrderStatus))
  const history = orders.filter((o) => TERMINAL.includes(o.status as OrderStatus))

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-stone-500">No orders yet.</p>
      ) : (
        <>
          {active.length > 0 && (
            <div className="flex flex-col gap-3">
              {active.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-medium tracking-widest uppercase text-stone-400">History</p>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <div className="flex flex-col gap-3">
                {history.map((order) => <OrderCard key={order.id} order={order} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

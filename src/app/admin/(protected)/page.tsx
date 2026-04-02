import Link from "next/link"
import { getAllOrders } from "@/modules/orders/queries"
import { getAllPosts } from "@/modules/content/queries"
import { getAllProducts } from "@/modules/shop/queries"

export const metadata = { title: "Dashboard | Admin" }

export default async function AdminDashboard() {
  const [orders, posts, products] = await Promise.all([
    getAllOrders(),
    getAllPosts(),
    getAllProducts(),
  ])

  const pendingOrders = orders.filter((o) => o.status === "PENDING")

  const stats = [
    { label: "Pending Orders", value: pendingOrders.length, href: "/admin/orders" },
    { label: "Total Orders", value: orders.length, href: "/admin/orders" },
    { label: "Posts", value: posts.length, href: "/admin/posts" },
    { label: "Products", value: products.length, href: "/admin/shop" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <p className="text-3xl font-semibold text-stone-900">{stat.value}</p>
            <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {pendingOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="font-medium text-amber-900 mb-3">
            {pendingOrders.length} pending order{pendingOrders.length > 1 ? "s" : ""}
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-amber-800 underline underline-offset-2"
          >
            Review orders →
          </Link>
        </div>
      )}
    </div>
  )
}

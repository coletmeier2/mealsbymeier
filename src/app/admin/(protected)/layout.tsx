import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { signOut } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/admin/login")

  async function signOutAction() {
    "use server"
    await signOut({ redirectTo: "/admin/login" })
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-52 border-r border-stone-200 bg-white flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-stone-200">
          <span className="font-semibold text-stone-900 text-sm">MealsByMeier</span>
        </div>
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 text-sm font-medium text-stone-600">
          <Link
            href="/admin"
            className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/admin/shop"
            className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/admin/orders"
            className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Orders
          </Link>
        </nav>
        <div className="p-3 border-t border-stone-200">
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createPost } from "@/modules/content/actions"
import ImageUpload from "@/components/ImageUpload"
import { CATEGORIES } from "@/modules/content/categories"

export const metadata = { title: "New Post | Admin" }

export default function NewPostPage() {
  async function handleSubmit(formData: FormData) {
    "use server"
    await createPost(formData)
    redirect("/admin/posts")
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">New Post</h1>

      <form action={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Image
          </label>
          <ImageUpload name="imageUrl" />
        </div>

        <div>
          <label
            htmlFor="caption"
            className="block text-sm font-medium text-stone-700 mb-2"
          >
            Caption
          </label>
          <textarea
            id="caption"
            name="caption"
            required
            rows={4}
            placeholder="Write your caption..."
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
          >
            <option value="">— No category —</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="block text-sm font-medium text-stone-700 mb-3">Publish to</p>
          <div className="flex flex-col gap-2">
            {(
              [
                { value: "site", label: "Site only" },
                { value: "instagram", label: "Instagram only" },
                { value: "both", label: "Site + Instagram" },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="publishTarget"
                  value={option.value}
                  defaultChecked={option.value === "site"}
                  className="accent-stone-900"
                />
                <span className="text-sm text-stone-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
          >
            Publish
          </button>
          <a
            href="/admin/posts"
            className="px-5 py-2 border border-stone-300 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}

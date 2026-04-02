"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"
import { createProduct } from "@/modules/shop/actions"

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

export default function NewProductPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function handleNameChange(val: string) {
    setName(val)
    if (!slugManuallyEdited) setSlug(toSlug(val))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const imageUrl = data.get("imageUrl") as string
    const description = data.get("description") as string
    const priceRaw = data.get("price") as string
    const isFeatured = data.get("isFeatured") === "on"

    if (!imageUrl) {
      setError("Please upload an image before submitting.")
      setSubmitting(false)
      return
    }

    const price = Math.round(parseFloat(priceRaw) * 100)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.")
      setSubmitting(false)
      return
    }

    try {
      await createProduct({ name, slug, description, price, imageUrl, isFeatured })
      router.push("/admin/shop")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">New Product</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-6">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Image</label>
          <ImageUpload name="imageUrl" />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Dark Chocolate Brownies"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-stone-700 mb-2">
            Slug
            <span className="text-stone-400 font-normal ml-2">— used in the URL</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugManuallyEdited(true)
            }}
            placeholder="dark-chocolate-brownies"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
          <p className="text-xs text-stone-400 mt-1">Auto-generated from name. Edit if needed.</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="A fudgy dark chocolate brownie with a crackling top and rich center..."
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
          />
          <p className="text-xs text-stone-400 mt-1">
            Lead with texture, aroma, and occasion — not just ingredients.
          </p>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-stone-700 mb-2">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="12.00"
              className="w-full border border-stone-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked
            className="accent-stone-900 w-4 h-4"
          />
          <span className="text-sm text-stone-700">
            Featured — show on the shop page
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Add Product"}
          </button>
          <a
            href="/admin/shop"
            className="px-5 py-2 border border-stone-300 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}

import { notFound } from "next/navigation"
import { getRecipeById } from "@/modules/recipes/queries"
import { updateRecipe } from "@/modules/recipes/actions"
import { getAllProducts } from "@/modules/shop/queries"

export const metadata = { title: "Edit Recipe | Admin" }

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [recipe, products] = await Promise.all([getRecipeById(id), getAllProducts()])

  if (!recipe) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    await updateRecipe(id, formData)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">Edit Recipe</h1>

      <form action={handleUpdate} className="flex flex-col gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={recipe.title}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-2">
            Content
            <span className="text-stone-500 font-normal ml-2">— markdown</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={18}
            defaultValue={recipe.content}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-y"
          />
        </div>

        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-stone-700 mb-2">
            Link to Product
            <span className="text-stone-500 font-normal ml-2">— optional</span>
          </label>
          <select
            id="productId"
            name="productId"
            defaultValue={recipe.product?.id ?? ""}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="">None</option>
            {products.map((product) => {
              const isLinkedHere = product.recipeId === recipe.id
              const isLinkedElsewhere = product.recipeId !== null && product.recipeId !== recipe.id
              return (
                <option key={product.id} value={product.id}>
                  {product.name}
                  {isLinkedHere ? " (currently linked)" : ""}
                  {isLinkedElsewhere ? " (recipe already linked)" : ""}
                </option>
              )
            })}
          </select>
          <p className="text-sm text-stone-500 mt-1">
            Customers who purchase this product will receive a token to access the recipe.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
          >
            Save Changes
          </button>
          <a
            href="/admin/recipes"
            className="px-5 py-2 border border-stone-300 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}

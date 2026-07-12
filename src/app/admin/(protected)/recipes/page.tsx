import Link from "next/link"
import { getAllRecipes } from "@/modules/recipes/queries"
import { deleteRecipe } from "@/modules/recipes/actions"

export const metadata = { title: "Recipes | Admin" }

export default async function AdminRecipesPage() {
  const recipes = await getAllRecipes()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="text-stone-500">No recipes yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900">{recipe.title}</p>
                <p className="text-sm text-stone-500 mt-0.5">
                  {recipe.product ? (
                    <span>Linked to <span className="text-stone-700">{recipe.product.name}</span></span>
                  ) : (
                    "No product linked"
                  )}
                </p>
              </div>
              <p className="text-sm text-stone-500 flex-shrink-0">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/recipes/${recipe.id}/edit`}
                  className="text-sm px-3 py-1 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server"
                    await deleteRecipe(recipe.id)
                  }}
                >
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

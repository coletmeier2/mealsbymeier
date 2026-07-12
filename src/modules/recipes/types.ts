export interface RecipeData {
  id: string
  title: string
  content: string // markdown
  createdAt: Date
  updatedAt: Date
}

export interface RecipeWithProduct extends RecipeData {
  product: {
    id: string
    name: string
    slug: string
  } | null
}

export interface RecipeAccessWithRecipe {
  id: string
  accessToken: string
  createdAt: Date
  recipe: RecipeData
}

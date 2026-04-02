export interface CreateProductInput {
  name: string
  slug: string
  description: string
  price: number // in cents
  imageUrl: string
  isFeatured?: boolean
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

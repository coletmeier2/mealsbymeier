export const CATEGORIES = [
  { slug: "cooked",      label: "Cooked Foods" },
  { slug: "desserts",    label: "Desserts" },
  { slug: "baked-goods", label: "Baked Goods" },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]

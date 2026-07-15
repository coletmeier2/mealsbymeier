export const runtime = "nodejs"

import { renderToBuffer } from "@react-pdf/renderer"
import { getRecipeByToken } from "@/modules/recipes/queries"
import RecipePdfDocument from "@/components/RecipePdfDocument"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const access = await getRecipeByToken(token)

  if (!access) {
    return new Response("Not found", { status: 404 })
  }

  const { recipe } = access
  const buffer = await renderToBuffer(
    <RecipePdfDocument title={recipe.title} content={recipe.content} />
  )

  const filename = `${recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

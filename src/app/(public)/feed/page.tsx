import Image from "next/image"
import { getPublishedPosts } from "@/modules/content/queries"

export const metadata = { title: "Feed | MealsByMeier" }

export default async function FeedPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">Feed</h1>
      {posts.length === 0 ? (
        <p className="text-stone-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-lg border border-stone-200 bg-white"
            >
              <div className="aspect-square relative bg-stone-100">
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-stone-700 line-clamp-3">{post.caption}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

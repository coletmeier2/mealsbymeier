import Link from "next/link"
import Image from "next/image"
import { getAllPosts } from "@/modules/content/queries"
import { deletePost } from "@/modules/content/actions"

export const metadata = { title: "Posts | Admin" }

export default async function AdminPostsPage() {
  const posts = await getAllPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-stone-500">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl p-4"
            >
              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-700 line-clamp-2">{post.caption}</p>
                <div className="flex gap-3 mt-1">
                  {post.publishedToSite && (
                    <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                      Site
                    </span>
                  )}
                  {post.publishedToInstagram && (
                    <span className="text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded px-2 py-0.5">
                      Instagram
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-stone-400 flex-shrink-0">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <form
                action={async () => {
                  "use server"
                  await deletePost(post.id)
                }}
              >
                <button
                  type="submit"
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

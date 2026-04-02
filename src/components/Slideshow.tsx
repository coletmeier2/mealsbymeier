"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export interface SlidePost {
  id: string
  imageUrl: string
  caption: string
  product?: { slug: string; name: string } | null
}

interface SlideshowProps {
  posts: SlidePost[]
  interval?: number
}

const MAX_THUMBS = 4

export default function Slideshow({ posts, interval = 5000 }: SlideshowProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (posts.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length)
    }, interval)
    return () => clearInterval(timer)
  }, [posts.length, interval])

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center w-full aspect-[3/4] max-w-xs bg-surface">
        <p className="font-sans text-muted text-xs tracking-widest uppercase">
          No posts yet
        </p>
      </div>
    )
  }

  const featured = posts[current]
  const thumbPosts = posts.filter((_, i) => i !== current).slice(0, MAX_THUMBS)

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

      {/* ── Featured card ── */}
      <div
        className="flex-shrink-0 w-full md:w-[min(45%,420px)]"
        style={{ position: "relative" }}
      >
        <div className="relative aspect-[3/4] w-full ring-1 ring-gold/50 ring-offset-[8px] ring-offset-brand overflow-hidden">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: caption + thumbnails ── */}
      <div className="flex-1 flex flex-col justify-between min-h-0 md:pt-2">

        {/* Caption */}
        <div className="border-l-2 border-gold/50 pl-5">
          <p className="font-sans text-ivory/80 text-sm leading-relaxed">
            {featured.caption}
          </p>
          {featured.product && (
            <Link
              href={`/shop/${featured.product.slug}`}
              className="inline-block mt-4 font-sans text-xs tracking-widest uppercase text-gold border border-gold/40 px-4 py-2 hover:bg-gold hover:text-brand transition-colors duration-200"
            >
              Shop {featured.product.name} →
            </Link>
          )}
        </div>

        {/* Thumbnails */}
        {thumbPosts.length > 0 && (
          <div className="mt-8">
            <p className="font-sans text-xs tracking-widest uppercase text-muted mb-3">
              More
            </p>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
              {thumbPosts.map((post) => {
                const idx = posts.indexOf(post)
                return (
                  <button
                    key={post.id}
                    onClick={() => setCurrent(idx)}
                    className="relative aspect-[3/4] overflow-hidden transition-all duration-300 opacity-35 hover:opacity-70 hover:ring-1 hover:ring-gold/30 hover:ring-offset-2 hover:ring-offset-brand focus:outline-none"
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 200px"
                    />
                  </button>
                )
              })}

              {/* Overflow count */}
              {posts.length > MAX_THUMBS + 1 && (
                <div className="relative aspect-[3/4] bg-surface flex items-center justify-center">
                  <p className="font-display text-gold text-2xl leading-none text-center">
                    +{posts.length - MAX_THUMBS - 1}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dot indicators */}
        {posts.length > 1 && (
          <div className="flex gap-2 mt-6">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-px transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-gold"
                    : "w-3 bg-ivory/20 hover:bg-ivory/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

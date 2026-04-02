"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function StickyWordmark() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed top-5 left-6 z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href="/"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="font-display text-ivory text-xl tracking-wide hover:text-gold transition-colors"
      >
        MealsByMeier
      </Link>
    </div>
  )
}

"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-display text-ivory text-3xl mt-10 mb-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-ivory text-2xl mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-ivory text-xl mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="font-sans text-ivory/80 text-sm leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="font-sans text-ivory/80 text-sm leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="text-ivory font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-ivory/70">{children}</em>
  ),
  hr: () => <hr className="border-gold/20 my-8" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-gold/40 pl-4 my-4 text-ivory/60 italic">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <div className="bg-surface rounded overflow-x-auto mb-4 whitespace-pre p-4">
      {children}
    </div>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className="text-gold font-mono text-sm">{children}</code>
    ) : (
      <code className="bg-surface text-gold font-mono text-xs px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
}

export default function RecipeContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}

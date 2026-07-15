import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { unified } from "unified"
import remarkParse from "remark-parse"
import type { Root, Content, PhrasingContent, ListItem } from "mdast"

// ─── Palette ────────────────────────────────────────────────────────────────

const c = {
  heading:  "#1a1410",
  text:     "#3d3530",
  muted:    "#8a8070",
  gold:     "#c8a96e",
  codeBg:   "#f5f0e8",
  border:   "#e8e0d0",
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 60,
    paddingTop: 56,
    paddingBottom: 56,
    fontFamily: "Helvetica",
  },

  // Header
  headerLabel: {
    fontSize: 8,
    letterSpacing: 3,
    color: c.gold,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: "Times-Roman",
    color: c.heading,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: c.border,
    marginBottom: 24,
    marginTop: 4,
  },

  // Headings
  h1: {
    fontSize: 20,
    fontFamily: "Times-Roman",
    color: c.heading,
    marginTop: 20,
    marginBottom: 8,
  },
  h2: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    color: c.heading,
    marginTop: 16,
    marginBottom: 6,
  },
  h3: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: c.heading,
    marginTop: 12,
    marginBottom: 4,
  },

  // Body
  paragraph: {
    fontSize: 11,
    color: c.text,
    lineHeight: 1.65,
    marginBottom: 8,
  },

  // Lists
  listWrap: { marginBottom: 8 },
  listRow: { flexDirection: "row", marginBottom: 3 },
  listBullet: { fontSize: 11, color: c.text, width: 18, flexShrink: 0 },
  listText: { fontSize: 11, color: c.text, lineHeight: 1.65, flex: 1 },

  // Code block
  codeWrap: {
    backgroundColor: c.codeBg,
    borderLeftWidth: 2,
    borderLeftColor: c.gold,
    borderLeftStyle: "solid",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  codeText: { fontSize: 9, fontFamily: "Courier", color: c.text },

  // Blockquote
  quoteWrap: {
    borderLeftWidth: 2,
    borderLeftColor: c.gold,
    borderLeftStyle: "solid",
    paddingLeft: 12,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 11,
    fontFamily: "Helvetica-Oblique",
    color: c.muted,
    lineHeight: 1.65,
  },

  // Thematic break
  rule: { height: 1, backgroundColor: c.border, marginVertical: 16 },

  // Footer (fixed — repeats on every page)
  footer: {
    position: "absolute",
    bottom: 28,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: c.muted, letterSpacing: 1 },
})

// ─── Inline renderer ────────────────────────────────────────────────────────

function renderInline(nodes: PhrasingContent[]): React.ReactNode {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "text":
        return <Text key={i}>{node.value}</Text>

      case "strong":
        return (
          <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>
            {renderInline(node.children as PhrasingContent[])}
          </Text>
        )

      case "emphasis":
        return (
          <Text key={i} style={{ fontFamily: "Helvetica-Oblique" }}>
            {renderInline(node.children as PhrasingContent[])}
          </Text>
        )

      case "inlineCode":
        return (
          <Text key={i} style={{ fontFamily: "Courier", fontSize: 9 }}>
            {node.value}
          </Text>
        )

      case "link":
        // Render link text only — no clickable URLs in print
        return (
          <Text key={i}>
            {renderInline(node.children as PhrasingContent[])}
          </Text>
        )

      default:
        return null
    }
  })
}

// ─── Block renderer ─────────────────────────────────────────────────────────

function renderNode(node: Content, index: number): React.ReactNode {
  switch (node.type) {
    case "heading": {
      const style = node.depth === 1 ? s.h1 : node.depth === 2 ? s.h2 : s.h3
      return (
        <Text key={index} style={style}>
          {renderInline(node.children as PhrasingContent[])}
        </Text>
      )
    }

    case "paragraph":
      return (
        <Text key={index} style={s.paragraph}>
          {renderInline(node.children as PhrasingContent[])}
        </Text>
      )

    case "list":
      return (
        <View key={index} style={s.listWrap}>
          {(node.children as ListItem[]).map((item, i) => {
            const bullet = node.ordered ? `${(node.start ?? 1) + i}.` : "•"
            const inline = item.children.flatMap((child) =>
              child.type === "paragraph" ? (child.children as PhrasingContent[]) : []
            )
            return (
              <View key={i} style={s.listRow}>
                <Text style={s.listBullet}>{bullet}</Text>
                <Text style={s.listText}>{renderInline(inline)}</Text>
              </View>
            )
          })}
        </View>
      )

    case "code":
      return (
        <View key={index} style={s.codeWrap}>
          <Text style={s.codeText}>{node.value}</Text>
        </View>
      )

    case "blockquote": {
      const inline = node.children.flatMap((child) =>
        child.type === "paragraph" ? (child.children as PhrasingContent[]) : []
      )
      return (
        <View key={index} style={s.quoteWrap}>
          <Text style={s.quoteText}>{renderInline(inline)}</Text>
        </View>
      )
    }

    case "thematicBreak":
      return <View key={index} style={s.rule} />

    default:
      return null
  }
}

// ─── Document component ─────────────────────────────────────────────────────

export default function RecipePdfDocument({
  title,
  content,
}: {
  title: string
  content: string
}) {
  const tree = unified().use(remarkParse).parse(content) as Root

  return (
    <Document title={title} author="MealsByMeier">
      <Page size="LETTER" style={s.page}>

        {/* Recipe header */}
        <Text style={s.headerLabel}>MEALSBYMEIER</Text>
        <Text style={s.title}>{title}</Text>
        <View style={s.divider} />

        {/* Recipe body */}
        {tree.children.map((node, i) => renderNode(node, i))}

        {/* Page footer — fixed repeats on every page */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>MealsByMeier — Personal Recipe</Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  )
}

/**
 * Ensure every blog post has a meta JSON file (title, description, focusKeyword, canonical, etc.).
 * Reads content/blog and content/blog/posts for .mdx/.md, writes content/blog/meta/{slug}.json if missing.
 * Run: npx tsx scripts/ensure-blog-meta.ts
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "content/blog")
const POSTS_DIR = path.join(BLOG_DIR, "posts")
const META_DIR = path.join(BLOG_DIR, "meta")
const BASE_URL = "https://lemah.store"

function getSlugs(): string[] {
  const slugs = new Set<string>()
  for (const dir of [POSTS_DIR, BLOG_DIR]) {
    if (!fs.existsSync(dir)) continue
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue
      slugs.add(file.replace(/\.(mdx|md)$/, ""))
    }
  }
  return [...slugs]
}

function readFrontmatter(slug: string): { data: Record<string, unknown> } | null {
  for (const dir of [POSTS_DIR, BLOG_DIR]) {
    for (const ext of [".mdx", ".md"]) {
      const filePath = path.join(dir, `${slug}${ext}`)
      if (!fs.existsSync(filePath)) continue
      try {
        const raw = fs.readFileSync(filePath, "utf8")
        const { data } = matter(raw)
        return { data }
      } catch {
        return null
      }
    }
  }
  return null
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x))
  if (v != null && typeof v === "string") return [v]
  return []
}

function main() {
  if (!fs.existsSync(META_DIR)) fs.mkdirSync(META_DIR, { recursive: true })
  const slugs = getSlugs()
  let created = 0
  for (const slug of slugs) {
    const metaPath = path.join(META_DIR, `${slug}.json`)
    if (fs.existsSync(metaPath)) continue
    const post = readFrontmatter(slug)
    const data = post?.data ?? {}
    const title = (data.meta_title as string) || (data.title as string) || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
    const description = (data.meta_description as string) || (data.title as string) || `Guide and tips for ${title} in Dubai and UAE. Lemah.`
    const focusKeyword = (data.focus_keyword as string) || (slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) + " Dubai")
    const secondaryKeywords = toArray(data.secondary_keywords).length ? toArray(data.secondary_keywords) : toArray(data.target_keywords).slice(0, 8)
    if (secondaryKeywords.length === 0) {
      secondaryKeywords.push(`${focusKeyword} UAE`, "football accessories Dubai", "football gifts UAE")
    }
    const canonical = (data.canonical_url as string) || `${BASE_URL}/blog/${slug}`
    const date = (data.date as string) || new Date().toISOString().slice(0, 10)
    const meta = {
      slug,
      title,
      description,
      focusKeyword,
      secondaryKeywords,
      canonical,
      ogTitle: title,
      ogDescription: description,
      datePublished: date,
      dateModified: date,
    }
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf8")
    created++
    console.log("Created:", metaPath)
  }
  console.log("Done. Created", created, "meta files. Total blog slugs:", slugs.length)
}

main()

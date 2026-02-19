# Blog SEO Setup Summary

## ✅ Completed

### 1. Infrastructure Setup
- ✅ Created blog directory structure (`content/blog/`, `app/blog/`, `seo/`)
- ✅ Blog listing page (`app/blog/page.tsx`) - displays all posts grouped by theme
- ✅ Dynamic blog post page (`app/blog/[slug]/page.tsx`) - renders MDX content with SEO metadata
- ✅ Sitemap updated to automatically include all blog posts
- ✅ Installed required dependencies (`gray-matter`, `next-mdx-remote`)

### 2. Blog Manifest
- ✅ Created `seo/blog-manifest.csv` with 27 entries from the prompt
- ⚠️ **Note**: Manifest currently has 27 entries, needs expansion to 110 total entries

### 3. Sample Article
- ✅ Created first complete blog article following the prompt format:
  - `content/blog/football-accessories-uae-in-dubai-uae-buying-guide-best-picks-2026.mdx`
  - Includes all required sections:
    - Frontmatter with all metadata
    - Quick Answer (40-60 words)
    - Why this matters in the UAE
    - How to choose (step-by-step)
    - Best picks / recommended types
    - Sizing & fit notes
    - Authenticity / quality checks
    - Care & maintenance
    - Real Madrid micro-story (when relevant)
    - FAQs (6-10 questions)
    - Internal links section
    - Sources

### 4. SEO Features
- ✅ JSON-LD Article schema in blog post template
- ✅ Dynamic metadata generation from frontmatter
- ✅ Open Graph tags for social sharing
- ✅ Automatic sitemap inclusion

## 📋 Remaining Tasks

### 1. Expand Blog Manifest to 110 Entries
The manifest currently has 27 entries. You need to:
- Add 83 more entries based on the keyword list in the prompt
- Ensure all entries follow the CSV format
- Validate slugs are unique
- Ensure meta titles are ≤ 60 characters
- Ensure meta descriptions include "UAE" + "Dubai" or "Abu Dhabi"

### 2. Generate Remaining Blog Articles
- **Current**: 1 article created (sample)
- **Remaining**: 109 articles needed
- **Word count**: 1,200-2,200 words per article
- **Total content**: ~130,000-240,000 words

Each article must include:
- Complete frontmatter
- All required sections (see sample article)
- 6-10 FAQs with UAE-specific questions
- Internal links to related posts and collections
- JSON-LD schema (automatically added by template)

### 3. Internal Linking System
- Link each post to 2-4 posts in the same cluster
- Link to 1-2 posts in adjacent clusters
- Link to 1 collection page (accessories/jerseys/real-madrid/keepers)
- Use natural anchor text (avoid exact-match overuse)

### 4. FAQ Schema
- The blog post template includes Article schema
- Need to add FAQPage schema with Q&A pairs from each post's FAQ section
- This can be added to the blog post template

## 📁 File Structure

```
football/
├── app/
│   └── blog/
│       ├── page.tsx              # Blog listing page
│       └── [slug]/
│           └── page.tsx          # Dynamic blog post page
├── content/
│   └── blog/
│       └── *.mdx                 # Blog articles (MDX format)
├── seo/
│   ├── blog-manifest.csv         # All 110 blog entries metadata
│   └── BLOG_SETUP_SUMMARY.md    # This file
└── app/
    └── sitemap.ts               # Updated to include blog posts
```

## 🚀 Next Steps

1. **Expand Manifest**: Add remaining 83 entries to `seo/blog-manifest.csv`
2. **Generate Articles**: Create MDX files in `content/blog/` following the sample format
3. **Add FAQ Schema**: Update blog post template to include FAQPage JSON-LD
4. **Internal Linking**: Ensure each post links to related posts and collections
5. **Test**: Verify blog listing and individual posts render correctly
6. **Deploy**: Push changes and verify sitemap includes all blog posts

## 📝 Article Template

Each article should follow this structure (see sample for reference):

```mdx
---
title: "Article Title"
slug: "article-slug"
date: "2026-01-14"
meta_title: "Meta Title (≤60 chars)"
meta_description: "Meta description (140-155 chars)"
focus_keyword: "primary keyword"
secondary_keywords: [...]
tags: [...]
theme: "Accessories|Jerseys|Goalkeeper"
canonical_url: "https://lemah.store/blog/slug"
---

# H1 Title

## Quick Answer
(40-60 words)

## Why This Matters in the UAE
(UAE context, climate, culture)

## How to Choose
(Step-by-step guide)

## Best Picks
(Recommendations + CTA)

## Sizing & Fit Notes
(Universal guidance)

## Authenticity / Quality Checks
(Verification tips)

## Care & Maintenance
(UAE climate-specific)

## Real Madrid / Football History
(Only when relevant, 2-4 paragraphs)

## Frequently Asked Questions
(6-10 UAE-specific FAQs)

## Shop Now
(Internal links to collections)

## Related Articles
(2-4 related posts)

## Sources
(3-6 credible references)
```

## ⚠️ Important Notes

- **Word Count**: Minimum 1,200 words, target 1,500-2,200 for priority keywords
- **UAE Geo-Targeting**: Must include "UAE", "Dubai", "Abu Dhabi" naturally in first 150 words
- **No Duplicates**: Each article must be unique - no copied paragraphs
- **Natural Language**: Avoid keyword stuffing, write naturally
- **Real Madrid Facts**: Only use verified facts from credible sources
- **Internal Links**: Every post must link to collections and related posts

## 🔗 Collection Links

Use these collection URLs for internal linking:
- `/shop?collection=accessories` - Football accessories
- `/shop?collection=real-madrid` - Real Madrid products
- `/shop?collection=jerseys` - Football jerseys (if exists)
- `/shop?collection=keepers` - Goalkeeper gear (if exists)

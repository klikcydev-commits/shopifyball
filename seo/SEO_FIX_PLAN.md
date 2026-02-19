# SEO Fix Plan — Lemah.store (UAE / Dubai)

## STEP 1 — Inventory

### 1.1 All existing routes and file paths

| Route | File path | Type |
|-------|-----------|------|
| Home | `app/page.tsx` | Page |
| About | `app/about/page.tsx` | Page |
| Contact | `app/contact/page.tsx` | Page |
| Shop | `app/shop/page.tsx` | Page |
| Products list | `app/products/page.tsx` | Page |
| Product PDP | `app/products/[handle]/page.tsx` | Dynamic |
| 11Kit | `app/11kit/page.tsx` | Page |
| Kit | `app/kit/page.tsx` | Page |
| Blog index | `app/blog/page.tsx` | Page |
| Blog post | `app/blog/[slug]/page.tsx` | Dynamic (MDX) |
| Search | `app/search/page.tsx` | Page |
| Catch-all | `app/pages/[...slug]/page.tsx` | Redirects |
| **Landing** | `app/football-gifts-dubai/page.tsx` | Page |
| **Landing** | `app/football-gifts-uae/page.tsx` | Page |
| **Landing** | `app/ronaldo-gifts-dubai/page.tsx` | Page |
| **Landing** | `app/messi-gifts-dubai/page.tsx` | Page |
| **Landing** | `app/football-gifts-for-teens-dubai/page.tsx` | Page |

**Content / config:**
- Layout (default meta): `app/layout.tsx`
- Blog content: `content/blog/*.mdx` (26 posts)
- Keywords pack: `content/keywords/uae-keywords.json` (created)
- Page JSON (optional): `content/pages/*.json` (to add per landing)

### 1.2 Issues

- **H1**: Home has H1; About/Shop/landings have H1. Product uses product title. Blog uses `data.title` — ensure one H1 per page.
- **Thin content**: About, Contact can use richer copy; landings have 500–900 words; blogs vary.
- **Meta**: Every route must have unique `title` + `description`; include Dubai/UAE where relevant. Blog: use `meta_title`, `meta_description`, `canonical_url`, `focus_keyword`, `secondary_keywords`.
- **Canonical**: Set on Blog (from frontmatter), landings, and key pages. Layout does not set canonical; set per page where needed.
- **Internal links**: Home → Football Gifts Dubai, Football Accessories Dubai, Teen Gifts Dubai. Footer → main UAE pages. Accessories pages → gifts + shop. Player pages → products + accessories. Blog posts → Shop + related posts.
- **FAQs**: Home, Shop, Product, each landing have FAQs. Contact page: add FAQ block or link. Blog: FAQs in body (keep).
- **11Kit**: Coming Soon page with `robots: noindex, follow` (already done).
- **Blog**: Add product strip at top (fetch from Shopify); full metadata + focus/secondary keywords in frontmatter; canonical in metadata.

### 1.3 Exact files to edit (SEO Fix Plan)

| Priority | File | Action |
|----------|------|--------|
| 1 | `app/layout.tsx` | Default title/description with Dubai & UAE (done) |
| 2 | `app/page.tsx` | Metadata; HomeSeoSections, HomeFaq (done) |
| 3 | `components/home/hero-section.tsx` | H1, hook, CTAs (done) |
| 4 | `components/home/home-seo-sections.tsx` | Cards + internal links (done) |
| 5 | `components/home/home-faq.tsx` | FAQ (done) |
| 6 | `app/about/page.tsx` | Metadata (done); optional: JSON or copy pass |
| 7 | `app/contact/page.tsx` | Metadata (title, description, focus keywords); optional FAQ |
| 8 | `app/shop/page.tsx` | Metadata, intro, FAQ (done) |
| 9 | `app/products/[handle]/page.tsx` | Metadata + canonical; ProductSeoBlock, ProductFaq (done) |
| 10 | `app/11kit/page.tsx` | Coming Soon + noindex (done) |
| 11 | `app/blog/page.tsx` | Metadata (title, description, Dubai/UAE) |
| 12 | `app/blog/[slug]/page.tsx` | generateMetadata: canonical, keywords; product strip at top |
| 13 | `content/blog/*.mdx` | Each: meta_title, meta_description, focus_keyword, secondary_keywords, canonical_url; sample first (ankle-guard) |
| 14 | Landing pages | Add if missing: football-accessories-dubai, football-accessories-uae, real-madrid-gifts-dubai, football-gifts-for-teens-uae, how-it-works |
| 15 | `content/pages/*.json` | Optional: per-landing JSON for copy/FAQ/links |
| 16 | `components/layout/footer.tsx` | Dubai & UAE column (done); add Football Accessories if new pages exist |

---

## Keyword packs

- **Location**: `content/keywords/uae-keywords.json`
- **Clusters**: football_gifts, football_accessories, ronaldo, messi, real_madrid, teen_intent (each with primary + secondary arrays).

---

## Per-route targets (H1 / Title / Meta)

See `seo/SEO_DELIVERABLES.md` for full table. Ensure About and Contact have:

- **About**: H1 kept; Title = "About Lemah | Football Gifts Dubai & UAE"; Description = premium football accessories and gifts, UAE delivery, gift-ready.
- **Contact**: H1 = e.g. "Contact Us"; Title = "Contact Lemah | Football Gifts Dubai & UAE"; Description = Get in touch for orders and support. Dubai & UAE.

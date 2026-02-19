# SEO Deliverables — Lemah.store (UAE / Dubai)

## 1. Modified & New Files

### Modified
- `app/layout.tsx` — Default metadata (title template, description, keywords, OG) with Dubai & UAE
- `app/page.tsx` — Home metadata; added HomeSeoSections, HomeFaq
- `app/about/page.tsx` — About metadata (title, description, OG)
- `app/shop/page.tsx` — Shop metadata; H1 "Shop Football Gifts & Accessories"; intro copy + internal links; ShopFaq
- `app/products/[handle]/page.tsx` — generateMetadata: title/description with "Football Gifts Dubai | Lemah" and UAE delivery
- `app/11kit/page.tsx` — Replaced full 11Kit with Coming Soon; metadata + robots noindex,follow
- `components/home/hero-section.tsx` — H1 "Football Gifts & Wall Art in Dubai & UAE"; hook copy; CTAs to /shop and #products
- `components/about/about-hero.tsx` — UAE delivery / gift-ready paragraph
- `components/product/product-details.tsx` — ProductSeoBlock + ProductFaq
- `components/layout/footer.tsx` — New "Dubai & UAE" column with 5 landing links; Shop "All Products" → /shop

### New
- `seo/SEO_FIX_PLAN.md` — Audit + fix plan
- `seo/SEO_DELIVERABLES.md` — This file
- `components/home/home-seo-sections.tsx` — Best Football Gifts Dubai, Ronaldo/Messi/Real Madrid, Teen Football Room Decor + internal links
- `components/home/home-faq.tsx` — Home FAQ (6 questions)
- `components/shop/shop-faq.tsx` — Shop FAQ (4 questions)
- `components/product/product-seo-block.tsx` — Reusable SEO block (UAE delivery, frame angle, gift use, internal links)
- `components/product/product-faq.tsx` — Product FAQ (4 questions)
- `components/kit/kit-coming-soon.tsx` — 11Kit Coming Soon teaser
- `components/landing/landing-page-template.tsx` — Reusable landing layout (intro + product grid + FAQ)
- `app/football-gifts-dubai/page.tsx`
- `app/football-gifts-uae/page.tsx`
- `app/ronaldo-gifts-dubai/page.tsx`
- `app/messi-gifts-dubai/page.tsx`
- `app/football-gifts-for-teens-dubai/page.tsx`

---

## 2. Per-Page H1, Title, Meta Description

| Page | H1 | Title | Meta Description |
|------|----|-------|------------------|
| Home | Football Gifts & Wall Art in Dubai & UAE | Football Gifts Dubai & UAE \| Lemah | Shop premium football gifts, wall art, and collectible frames in Dubai & UAE. Perfect for teens and football fans. Fast UAE delivery. |
| About | Built for the eleven. | About Lemah \| Football Gifts Dubai & UAE | Premium football accessories and gifts in Dubai & UAE. Quality collectibles, UAE delivery, gift-ready packaging. |
| Shop | Shop Football Gifts & Accessories | Football Gifts & Accessories Dubai \| Shop Lemah | Browse football gifts, accessories, and wall art in Dubai & UAE. Ronaldo, Messi, Real Madrid gifts. Fast UAE delivery. |
| 11Kit | Build Your Eleven (Coming Soon) | 11Kit Coming Soon \| Lemah | Build your 11Kit — coming soon. Curated football accessory system for Dubai & UAE. |
| Product (dynamic) | {product.title} | {product.title} \| Football Gifts Dubai \| Lemah | {product description truncated} — Dubai & UAE delivery. |
| football-gifts-dubai | Best Football Gifts in Dubai | Football Gifts Dubai \| Gifts for Football Fans \| Lemah | Find the best football gifts in Dubai. Premium accessories, wall art, and collectibles for football lovers. Fast Dubai delivery. |
| football-gifts-uae | Football Gifts UAE | Football Gifts UAE \| Gifts for Football Lovers \| Lemah | Shop football gifts across the UAE. Premium accessories, wall art, and collectibles for football fans. UAE delivery. |
| ronaldo-gifts-dubai | Ronaldo Gifts Dubai | Ronaldo Gifts Dubai \| CR7 Football Fan Gifts \| Lemah | Ronaldo and CR7 football gifts in Dubai. Premium collectibles for football fans. Dubai & UAE delivery. |
| messi-gifts-dubai | Messi Gifts Dubai | Messi Gifts Dubai \| Lionel Messi Football Gifts \| Lemah | Messi and Lionel Messi football gifts in Dubai. Premium collectibles for football fans. Dubai & UAE delivery. |
| football-gifts-for-teens-dubai | Football Gifts for Teens Dubai | Football Gifts for Teens Dubai \| Gifts for Boys UAE \| Lemah | Football gifts for teens and boys in Dubai & UAE. Perfect for bedrooms and match day. UAE delivery. |

---

## 3. FAQ Questions Used per Landing Page

### Home (home-faq.tsx)
1. Where can I buy football gifts in Dubai?
2. Do you deliver football gifts to the UAE?
3. What are the best football gifts for teens in Dubai?
4. Do you have Ronaldo or Messi gifts in Dubai?
5. Are your football frames good for wall art in Dubai?
6. Is Lemah a football shop or football store in the UAE?

### Shop (shop-faq.tsx)
1. Do you deliver football accessories to Dubai and the UAE?
2. What football gifts can I find in your shop?
3. Do you have Ronaldo or Messi gifts?
4. Is this a football shop or football store in the UAE?

### Product (product-faq.tsx)
1. Do you ship this product to Dubai and the UAE?
2. Is this a good football gift for a teen or boy?
3. Can I use this as football wall art or bedroom decor?
4. Is the product gift-ready?

### football-gifts-dubai
1. Where can I buy football gifts in Dubai?
2. What are the best football gifts for someone in Dubai?
3. Do you deliver football gifts to Dubai?
4. Are your football gifts unique?
5. Can I send a football gift to a friend in Dubai?

### football-gifts-uae
1. Do you deliver football gifts across the UAE?
2. What football gifts can I buy in the UAE?
3. Are you a football store in the UAE?
4. Can I get Ronaldo or Messi gifts in the UAE?
5. What are good football gifts for teens in the UAE?

### ronaldo-gifts-dubai
1. Do you have Ronaldo gifts in Dubai?
2. What Ronaldo gifts can I send to Dubai?
3. Are Ronaldo gifts good for teens in Dubai?
4. Do you deliver Ronaldo gifts to the UAE?

### messi-gifts-dubai
1. Do you have Messi gifts in Dubai?
2. What Messi gifts can I send to Dubai?
3. Are Messi gifts good for teens in Dubai?
4. Do you deliver Messi gifts to the UAE?

### football-gifts-for-teens-dubai
1. What are the best football gifts for teens in Dubai?
2. Do you have football gifts for boys in the UAE?
3. Are your football gifts good for teenage boys?
4. Do you deliver football gifts for teens to Dubai?
5. Can I use these as football bedroom decor in Dubai?

---

## 4. Verification Checklist (Google & On-Page)

- [ ] **View page source** on each key page: confirm unique `<title>` and `<meta name="description" content="...">` (no duplicates, Dubai/UAE where intended).
- [ ] **11Kit** `/11kit`: confirm `<meta name="robots" content="noindex, follow">` (or equivalent) and Coming Soon content only.
- [ ] **Lighthouse** (Chrome DevTools): run SEO audit on Home, Shop, one Product, one landing (e.g. football-gifts-dubai); fix any critical issues.
- [ ] **Sitemap**: ensure new routes are in sitemap (e.g. `/football-gifts-dubai`, `/football-gifts-uae`, `/ronaldo-gifts-dubai`, `/messi-gifts-dubai`, `/football-gifts-for-teens-dubai`). If using `next-sitemap` or similar, regenerate after deploy.
- [ ] **Request indexing** in Google Search Console for the new landing pages and updated Home/Shop URLs.
- [ ] **Internal links**: spot-check Home → Dubai/UAE/teens landings; Footer → all 5 landings; landing pages → Shop and each other.

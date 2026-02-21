# Sale Pricing UI Fix - Diagnostic & Resolution

## Status: DIAGNOSTIC LOGGING ADDED ✅

The sale pricing UI is **already correctly implemented** in the codebase. The issue is likely one of:
1. Data not present in Shopify (compare-at price not set)
2. Query fetching wrong variant
3. Adapter mapping issue

## What I Added

### 1. Enhanced Logging (Development Mode Only)

**File: `lib/shopify/adapter.ts`**
- Logs products that have `compareAtPrice` from Shopify API
- Visible in terminal where `npm run dev` is running

**File: `components/products/product-card.tsx`**
- Logs pricing data for each product card with compare-at price
- Visible in browser console (F12 → Console tab)

### 2. Diagnostic Script

**File: `scripts/diagnose-sale-pricing.ts`**
- Run: `npx tsx scripts/diagnose-sale-pricing.ts` (after `npm install` in worktree)
- Fetches products and verifies sale pricing logic end-to-end

---

## Verification Steps (MUST DO FIRST)

### A. Verify Data in Shopify Admin

1. **Open Shopify Admin** → **Products**
2. **Pick 1-2 products** that should show as "on sale"
3. **Check each variant:**
   - Click Edit variant
   - Verify **Price** (e.g. 60.00) < **Compare at price** (e.g. 90.00)
   - **Save** if you made changes
4. **Note the product handle** (in URL: `/admin/products/12345` or slug)

### B. Verify Data in Next.js App

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12 → Console tab)

3. **Navigate to home page** or **/shop**

4. **Look for logs:**
   ```
   🔍 [SALE PRODUCT]: { title: "...", handle: "...", compareAtPriceRange: "90.00", variantCompareAt: "90.00" }
   🏷️ [ProductCard]: { handle: "...", "product.compareAtPrice": "90.00", "cardPricing.isSale": true }
   ```

5. **If no logs appear:**
   - ❌ Compare-at price is **NOT** in Shopify or **NOT** being fetched
   - → Check Shopify Admin (step A)
   - → Check Storefront API query (see below)

6. **If logs show compareAtPrice but `isSale: false`:**
   - Check `variantForSale` object in log
   - Likely: compareAtPrice is a string not being parsed correctly

---

## Current Implementation (Already Correct ✅)

### UI Components

**ProductCard** (`components/products/product-card.tsx`)
- Lines 61-72: Selects `displayVariant` (first available variant)
- Lines 70-72: Uses `getCardPricing()` and `getSaleState()` from `lib/sale-helpers.ts`
- Lines 186-199: Renders sale price UI:
  - Struck-through compare-at price
  - Bold sale price
  - "Save X (Y%)" message

**QuickViewModal** (`components/products/quick-view-modal.tsx`)
- Lines 141-149: Uses same pricing logic as ProductCard
- Lines 212-236: Renders sale price UI in modal

**Sale Helpers** (`lib/sale-helpers.ts`)
- `getCardPricing()`: Returns `{ isSale: true/false, price, compare, currencyCode }`
- `getSaleState()`: Returns formatted strings for display
- **Logic:** `isSale` when `compareAtPrice > price` (line 45)

### Data Flow

1. **Shopify API** (`lib/shopify/queries.ts` lines 68-85)
   ```graphql
   variants(first: 1) {
     nodes {
       price { amount currencyCode }
       compareAtPrice { amount currencyCode }  ✅ Already requested
     }
   }
   ```

2. **Adapter** (`lib/shopify/adapter.ts` lines 34-48)
   ```ts
   compareAtPrice: node.compareAtPrice?.amount ?? undefined  ✅ Already mapped
   ```

3. **ProductCard** (lines 61-72)
   ```ts
   const displayVariant = variants.find(v => v.availableForSale) ?? variants[0]
   const variantForSale = {
     price: displayVariant.price,
     compareAtPrice: displayVariant.compareAtPrice,  ✅ Already used
     currencyCode: displayVariant.currencyCode
   }
   ```

---

## Potential Issues & Fixes

### Issue 1: Compare-at Price Not Set in Shopify

**Symptom:** No logs appear, or logs show `compareAtPrice: null`

**Fix:** 
1. Use the CSV generator to bulk set compare-at prices:
   ```bash
   npm run generate-sale-csv
   ```
2. Import `scripts/output/sale_all.csv` in Shopify Admin:
   - Products → Import
   - Choose file → Overwrite products with matching handles
   - Import

### Issue 2: Query Fetches Only 1 Variant (variants(first: 1))

**Symptom:** Product has multiple variants; only first variant has sale price, but card shows non-sale variant

**Current State:** Query already requests `variants(first: 1)` - this is correct IF:
- All variants have same pricing, OR
- Products are single-variant (most common for wall art/frames)

**Fix (if needed):**
If you have multi-variant products where only SOME variants are on sale:

1. **Option A:** Update query to fetch more variants:
   ```ts
   // In lib/shopify/queries.ts line 68
   variants(first: 10) {  // Increase from 1 to 10
   ```

2. **Option B:** Update variant selection logic:
   ```ts
   // In components/products/product-card.tsx line 61-62
   // Prefer sale variant over just first available
   const displayVariant =
     product.variants?.find((v) => v.availableForSale && v.compareAtPrice && parseFloat(v.compareAtPrice) > parseFloat(v.price)) ??
     product.variants?.find((v) => v.availableForSale) ??
     product.variants?.[0] ?? null
   ```

### Issue 3: Adapter Maps Wrong Variant

**Symptom:** Logs show `variantCompareAt: "90.00"` but `product.compareAtPrice: undefined`

**Current Fix:** Already correct (line 45 uses `node.compareAtPrice?.amount`)

**Verify:** Check browser console for `🏷️ [ProductCard]` log - should show both values

### Issue 4: CSS Hides Sale UI

**Symptom:** Logs show `isSale: true` but UI doesn't change

**Check:**
1. Inspect element in browser (right-click sale price → Inspect)
2. Look for:
   - `display: none`
   - `opacity: 0`
   - `visibility: hidden`
   - `overflow: hidden` cutting off text

**Fix:** Remove/adjust CSS if found

---

## Next Steps

1. **Run verification steps A & B above** ✅ **CRITICAL**
2. **Share console logs** with me (screenshot or paste)
3. Based on logs, I'll apply specific fix from "Potential Issues" section

---

## Files Changed

- ✅ `lib/shopify/adapter.ts` - Enhanced logging
- ✅ `components/products/product-card.tsx` - Added debug logging
- ✅ `scripts/diagnose-sale-pricing.ts` - Diagnostic script
- ✅ `scripts/generate-sale-csv.ts` - CSV generator (already existed)
- ✅ `scripts/sale-csv-config.ts` - Config (already existed)

---

## Quick Test (After Setting Compare-at Price)

1. **Pick a test product** (e.g. `mbappe-m9-style-01`)
2. **Shopify Admin:**
   - Price: 60.00
   - Compare at price: 90.00
   - Save
3. **Next.js app:**
   - Hard refresh (Ctrl+Shift+R)
   - Navigate to /shop
   - Product card should show:
     - Red "SALE" badge (top-left of image)
     - ~~90.00 AED~~ (struck through, gray)
     - **60.00 AED** (bold, black)
     - Save 30.00 AED (33%)

If this works for 1 product → bulk update all via CSV.

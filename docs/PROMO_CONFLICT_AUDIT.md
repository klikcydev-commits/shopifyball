# Promo / Discount UI — Conflict Audit Report

**Date:** 2026-02  
**Scope:** Prevent promo messaging (% OFF, free shipping banner) from being overridden or hidden.

---

## A) Conflict Report

### 1) Discount / Sale logic conflicts

| Finding | Status | Action |
|--------|--------|--------|
| **Single source of truth** | OK | Sale comes only from `getSale()` / `getSaleState()` in `lib/sale-helpers.ts` using `compareAtPrice > price`. No double-discount. |
| **ProductPrice component** | OK | Uses only `compareAtPrice` vs `price` for percentOff; no extra discount applied. |
| **cache-discounts.ts** | OK | `getDisplayPricesForDiscount()` and `getCachedDiscounts()` exist but are **not used** by any product card, PDP, or cart UI. No removal needed; left as server-only optional logic. |
| **Header promo strip** | OK | Uses `getHeaderPromoAction()` (sale count from products). Separate from PromoBanner; does not override or hide it. |

**Conclusion:** No conflicting sale logic. percentOff is computed only from compareAtPrice vs price.

---

### 2) UI / Styling conflicts (modal, cart, banner)

| Finding | Status | Action |
|--------|--------|--------|
| **PromoBanner container** | OK | Renders as direct child of `PromotionsProvider` in root layout; no parent with `overflow: hidden` or `position: relative` that would clip it. |
| **Cart drawer** | OK | Uses `opacity-0 pointer-events-none` only when closed (intended). No classes hiding promo or price elements when open. |
| **Quick view modal** | OK | Renders via portal to `document.body` with fixed positioning; not trapped inside a section. |
| **Z-index** | OK | PromoBanner in document flow at top of body; Header is `fixed z-50`. No stacking context issues found. |

**Conclusion:** No CSS or layout found that hides the promo banner or sale UI. No refactor to portal/fixed needed for the banner.

---

### 3) Cart state conflicts

| Finding | Status | Action |
|--------|--------|--------|
| **Cart updates** | OK | `setCartFromShopify()` is called on add, remove, update, discount apply/remove; cart re-renders. |
| **Stale memoization** | OK | No `useMemo` on cart lines with incorrect deps; no React cache misuse for cart. |
| **cartItemCount** | OK | Uses `cart.totalQuantity`; updates when cart is replaced from Shopify. |

**Conclusion:** Cart UI and counts stay in sync with server cart.

---

### 4) Data / Query conflicts

| Finding | Status | Action |
|--------|--------|--------|
| **Storefront product/collection queries** | OK | Include `compareAtPrice { amount currencyCode }` for variants. |
| **Cart query (getCartQuery)** | OK | Lines include `merchandise.compareAtPrice { amount currencyCode }`. |
| **Cart adapter** | OK | Maps `compareAtPrice` to `line.compareAtPrice` and `variant.compareAtPrice`. |
| **Selected variant** | OK | PDP and quick view use selected variant for price/sale; product card uses first available variant. |

**Conclusion:** compareAtPrice is present and used for sale display everywhere.

---

### 5) Promo endpoint conflicts

| Finding | Status | Action |
|--------|--------|--------|
| **/api/promotions** | OK | Uses `getPromotions()`; cache 120s, tag `"promotions"`; webhook revalidates. Returns `hasActivePromos` and `promos` (no incorrect empty cache). |
| **/api/active-discounts** | OK | Separate endpoint; used only by `lib/cache-discounts.ts`, which is not used by any product/cart UI. No conflict with promo banner. |

**Conclusion:** Promo data is correct and cache is sane; no conflicting empty responses.

---

## B) Implemented After Audit

1. **% OFF + sale badge**
   - Already present on product card, quick view, PDP, and cart line items via `getSaleState()` and optional “X% OFF” label.
   - No code changes; verified no logic overrides.

2. **Free shipping “2+ items” progress banner (when promo active)**
   - **File:** `components/cart/cart-drawer.tsx`
   - When `hasFreeShipping` from promotions is true:
     - If `cart.totalQuantity >= 2`: show “Free delivery unlocked” (green).
     - Else: show “Add X more item(s) for free delivery” and “Free shipping on orders with 2+ items” (amber).
   - Shown only when a free-shipping promo exists in Shopify (no hardcoded offer when no promo).

---

## C) File Paths Changed

| File | Change |
|------|--------|
| `components/cart/cart-drawer.tsx` | Added conditional free-shipping progress block (2+ items) when `hasFreeShipping` is true. |
| `docs/PROMO_CONFLICT_AUDIT.md` | Added (this audit report). |

No files were found that override or hide discount UI; no removals or refactors were required for visibility.

# Shopify Pricing & Discount Display (Next.js Storefront)

This document describes how pricing and discounts are sourced from Shopify and displayed on the Next.js storefront so that **totals match Shopify checkout** and no discounts are invented locally.

---

## 1. Where Shopify Discount Data Comes From

### Storefront API as source of truth

All displayed prices and discount amounts come from the **Shopify Storefront API** (Cart and Product/Collection queries). We do not compute discounts in Next.js; we only display what Shopify returns.

| Display | Source (Storefront API) |
|--------|--------------------------|
| **Product/variant price** | `ProductVariant.price`, `Product.priceRange.minVariantPrice` |
| **Compare-at (sale) price** | `ProductVariant.compareAtPrice`, `Product.compareAtPriceRange`, or cart line `merchandise.compareAtPrice` |
| **Cart subtotal** | `Cart.cost.subtotalAmount` — amount before cart-level discounts |
| **Cart total** | `Cart.cost.totalAmount` — final amount customer pays (after automatic + code discounts) |
| **Cart discount amount** | `Cart.discountAllocations[].discountedAmount` (sum) — total discount applied to cart |
| **Applied discount codes** | `Cart.discountCodes[]` — `{ code, applicable }` for each code |
| **Line total in cart** | `CartLine.cost.totalAmount` — Shopify-calculated line total (includes line-level discounts) |

### Cart cost semantics (Shopify)

- **subtotalAmount**: Amount before taxes and **cart-level** discounts (automatic + discount codes). Includes line-level compare-at/price rules that are already reflected in variant prices.
- **totalAmount**: Final amount the buyer will pay at checkout. Already reduced by automatic discounts and discount codes.
- **discountAllocations**: List of cart-level discount allocations; sum = (subtotalAmount − totalAmount) when only discounts apply (no tax in cart in some markets).

So: **Subtotal** (from API) − **Discounts** (from API) ≈ **Total** (from API). The UI shows these three explicitly so the customer sees the same breakdown as checkout.

---

## 2. What We Support

| Type | How it’s reflected |
|------|---------------------|
| **Compare-at price (sale)** | Product/variant `compareAtPrice` from Storefront API. Shown as strikethrough + sale price + “X% OFF” and “You save $X (Y%)” on PDP and product cards. In cart, line uses `line.cost.totalAmount` and optional `compareAtPrice` for strikethrough. |
| **Automatic discounts** | Applied by Shopify to the cart. Reflected in `cost.subtotalAmount`, `cost.totalAmount`, and `discountAllocations`. Cart UI shows “Discounts” row and correct Total. No need to compute them in Next.js. |
| **Discount codes** | Customer enters code in cart; we call `cartDiscountCodesUpdate`. Shopify validates and applies; response includes updated `cost`, `discountCodes`, `discountAllocations`. We refetch cart and show updated totals and applied code chips. |

---

## 3. Implementation Overview

### Cart (Storefront API)

- **Create/read cart**: `cartCreate`, `getCart` — cart ID persisted in `localStorage` (`lemah_cart_id`).
- **Lines**: `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove` — all return full cart with `cost`, `discountCodes`, `discountAllocations`, and `lines[].cost`.
- **Discount codes**: `cartDiscountCodesUpdate(cartId, discountCodes)` — pass full list of codes (e.g. add one or remove one); empty array clears all.

### Adapter (`lib/shopify/cart-adapter.ts`)

- **Subtotal**: `shopifyCart.cost.subtotalAmount.amount`
- **Total**: `shopifyCart.cost.totalAmount.amount`
- **Discount amount**: Sum of `shopifyCart.discountAllocations[].discountedAmount.amount`
- **Discount codes**: `shopifyCart.discountCodes` → `Cart.discountCodes`
- **Line total**: `node.cost.totalAmount.amount` for each line (and optional `compareAtPrice` from merchandise)
- **Tax**: `shopifyCart.cost.totalTaxAmount?.amount` if present; otherwise UI shows “Calculated at checkout”

No local discount math; only mapping from API shape to UI shape.

### Product/card pricing

- **ProductPrice** receives `price` and `compareAtPrice` (from product/variant or from active automatic-discount logic if used). When `compareAtPrice > price` it shows strikethrough, sale price, “X% OFF”, and optionally “You save $X (Y%)”.
- Product card and PDP use Storefront product/variant `price` and `compareAtPrice`; cart uses `line.cost.totalAmount` and optional `compareAtPrice` for line display.

### UX

- **Sale badge**: Shown when `compareAtPrice > price` (product/card) or when line has compare-at (cart).
- **Cart summary**: Subtotal, Discounts (if any), Shipping (“Calculated at checkout”), Taxes (from API or “Calculated at checkout”), Total.
- **Discount code**: Input in cart; apply calls `applyDiscountCodesAction`; applied codes shown as chips with remove; success/error via toast.

---

## 4. How We Guarantee Accuracy

1. **No local discount calculation** — We never compute “discount = subtotal − total” for display; we use `discountAllocations` and `cost` from the API. Subtotal/total are from Shopify.
2. **Line totals from Shopify** — Each cart line displays `line.cost.totalAmount` (or fallback to `price × quantity` only when API doesn’t return cost). So line totals match checkout.
3. **Discount codes only via API** — Applying/removing codes is done with `cartDiscountCodesUpdate`; cart is refetched and UI updated from the new response.
4. **Compare-at only from API** — We show compare-at only when the Storefront API returns `compareAtPrice` (or cart line `compareAtPrice`). No invented “original” prices.

---

## 5. Test Plan

Use these scenarios to verify that the Next.js UI matches Shopify checkout.

| # | Scenario | Steps | Expected |
|---|----------|--------|----------|
| 1 | **Compare-at sale product** | 1) In Shopify Admin set a variant compare-at price > selling price. 2) Open product on storefront. 3) Add to cart; open cart. | PDP and card show strikethrough original, sale price, “X% OFF”, “You save $X (Y%)”. Cart line shows line total equal to (sale price × qty); cart Subtotal/Total match Shopify. |
| 2 | **Automatic discount active** | 1) In Shopify create an automatic discount (e.g. 10% off collection X). 2) Add a product from that collection to cart. 3) Open cart. | Cart Subtotal = sum of line prices (or Shopify subtotal). Cart shows “Discounts” with amount. Total = Subtotal − Discounts. Same Total as on Shopify checkout. |
| 3 | **Discount code apply** | 1) Create a discount code in Shopify. 2) Add items to cart. 3) Enter code in cart “Discount code” field; Apply. | Toast “Discount applied”. Applied code appears as chip. Discounts row shows amount; Total decreases. Removing code (X on chip) updates cart; Total increases. |
| 4 | **Discount code invalid** | 1) Enter an invalid or expired code; Apply. | Toast “Discount failed” with message. No change to totals. |
| 5 | **Multi-quantity and multiple items** | 1) Add same variant qty > 1. 2) Add another product. 3) Optionally apply automatic or code discount. | Line totals = `line.cost.totalAmount`. Subtotal + Discounts + Shipping/Taxes labels match checkout. Total matches Shopify checkout Total. |
| 6 | **Proceed to checkout** | From cart, click “Proceed to Checkout”. | Redirect to Shopify checkout. Checkout page shows same Subtotal, Discount(s), and Total as the Next.js cart (within rounding/tax display differences allowed by Shopify). |

---

## 6. Files Reference

| Area | Files |
|------|--------|
| Cart API | `lib/shopify/queries.ts` (cart mutations + getCart + cartDiscountCodesUpdate), `lib/shopify/index.ts` (createCart, addToCart, updateCart, removeFromCart, getCart, applyDiscountCodes) |
| Cart adapter | `lib/shopify/cart-adapter.ts` |
| Cart types | `lib/shopify/types.ts` (ShopifyCart), `lib/shopify-types.ts` (Cart, CartLine, CartDiscountCode) |
| Actions | `app/actions/cart-actions.ts` (getCartAction, addToCartAction, updateCartAction, removeFromCartAction, applyDiscountCodesAction) |
| Context | `components/cart/cart-context.tsx` (cart state, applyDiscountCode, removeDiscountCode, persistence) |
| UI | `components/cart/cart-drawer.tsx`, `components/cart/cart-summary.tsx`, `components/cart/cart-discount-code.tsx` |
| Price display | `components/products/product-price.tsx`, `components/product/product-details.tsx`, `components/products/product-card.tsx` |

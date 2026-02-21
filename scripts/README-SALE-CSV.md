# Sale CSV generator (Compare-at price update)

Generates Shopify CSV files to set **Compare-at price** so the sale UI (struck old price + new price) appears on product cards.

## Output files

- **`scripts/output/sale_all.csv`** — Sets compare-at price for **all products** in collections: CR7, Mbappe, Legends (and “The Legends”, M9).
- **`scripts/output/sale_selected.csv`** — Sets compare-at price only for products in your selected-handles list (e.g. “Best Deals” or a custom list).

## Setup

1. **Env**  
   Ensure `.env.local` has:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

2. **Config**  
   Edit `scripts/sale-csv-config.ts`:
   - `COMPARE_AT_PRICE` — e.g. `'90.00'` (AED).
   - `VARIANT_PRICE` — e.g. `'60.00'` (leave `''` to keep current price).
   - `SALE_ALL_COLLECTION_MATCH` — Collection title/handle substrings for “sale all” (default: CR7, Mbappe, Legends, The Legends, M9).
   - `SALE_SELECTED_HANDLES` — Handles for “sale selected”, or use `scripts/selected-handles.txt` (one handle per line).

## Run

From project root:

```bash
npm run generate-sale-csv
```

Or with npx:

```bash
npx tsx scripts/generate-sale-csv.ts
```

Output is written to `scripts/output/sale_all.csv` and `scripts/output/sale_selected.csv`.

## Import in Shopify

1. **Shopify Admin** → **Products** → **Import**.
2. Upload `sale_all.csv` or `sale_selected.csv`.
3. Choose **Overwrite products with matching handles**.
4. Map columns (Handle, Title, Option1 Name, Option1 Value, Price, Compare-at price) if needed.
5. Import.

Only the **Price** and **Compare-at price** columns are changed; titles, descriptions, and images are left as-is.

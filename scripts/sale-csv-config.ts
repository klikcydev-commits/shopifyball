/**
 * Config for generating Shopify sale CSV update files.
 * Edit these values before running the generator.
 */

/** Compare-at price (old price) to set in AED. Sale shows when compare-at > price. */
export const COMPARE_AT_PRICE = '90.00'

/** Sale price to keep in AED. Leave empty to keep each product's current price. */
export const VARIANT_PRICE = '60.00'

/**
 * Collection title or handle match for "sale_all" CSV.
 * Products in any collection whose title or handle matches one of these will be included.
 */
export const SALE_ALL_COLLECTION_MATCH = ['CR7', 'Mbappe', 'Legends', 'The Legends', 'M9']

/**
 * Handles for "sale_selected" CSV (e.g. products tagged "Best Deals").
 * Add handles here, or put one handle per line in scripts/selected-handles.txt.
 */
export const SALE_SELECTED_HANDLES: string[] = [
  // e.g. 'messi-jersey', 'ronaldo-poster'
]

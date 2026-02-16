import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with currency symbol - always displays as Dhs. (Dirhams)
 * @param amount - Price amount as string (e.g., "29.99")
 * @param currencyCode - Currency code from Shopify (ignored, always shows Dhs.)
 * @returns Formatted price string (e.g., "Dhs. 1,234.00")
 */
export function formatPrice(amount: string | number, currencyCode: string = 'AED'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) {
    return 'Dhs. 0.00'
  }
  
  // Format with thousand separators (commas)
  const formatted = numAmount.toFixed(2)
  const parts = formatted.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // Add comma separators for thousands
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formattedAmount = `${formattedInteger}.${decimalPart}`
  
  // Always display as Dhs. regardless of currency from Shopify
  return `Dhs. ${formattedAmount}`
}

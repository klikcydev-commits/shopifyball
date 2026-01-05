'use server'

import { getMenu } from '@/lib/shopify'
import type { ShopifyMenu } from '@/lib/shopify/types'

export async function fetchMenu(handle: string = 'main-menu'): Promise<ShopifyMenu | null> {
  try {
    const menu = await getMenu(handle)
    return menu
  } catch (error) {
    console.error('Error fetching menu:', error)
    return null
  }
}


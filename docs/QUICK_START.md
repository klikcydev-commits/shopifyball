# Quick Start Guide

Get your Next.js ecommerce store up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Step 2: Set Up Environment Variables

Create `.env.local` in the root directory:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your-private-token-here
SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Get Shopify Credentials

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Name it (e.g., "Storefront API")
4. Click **Configure Storefront API**
5. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
6. Click **Save**
7. Click **Install app**
8. Copy the **Storefront API access token**

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Set Up Products in Shopify

1. Go to **Shopify Admin** → **Products**
2. Create products or import existing ones
3. Create **Collections** to organize products
4. Ensure products are **published** and **available for sale**

## Step 6: Test Your Store

- Visit `/search` to see all products
- Click on a product to view details
- Add items to cart
- Test checkout flow

## Troubleshooting

### Products not showing?
- Verify Shopify credentials in `.env.local`
- Check that products are published in Shopify
- Ensure Storefront API permissions are correct

### Cart not working?
- Check browser console for errors
- Verify localStorage is enabled
- Ensure cart mutations have correct permissions

### Build errors?
```bash
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run dev
```

## Next Steps

- Customize colors in `tailwind.config.ts`
- Add your logo to `components/layout/header.tsx`
- Set up webhooks for automatic revalidation
- Deploy to Vercel for production

For detailed documentation, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)


# EMBELLISH — Next.js Ecommerce Store

A premium female accessories ecommerce store (handbags, jewellery, beanies) built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Zustand.

## Setup

### Step 1: Create a fresh Next.js project

```bash
npx create-next-app@latest embellish --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd embellish
```

When prompted:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Customize import alias: **No** (keep `@/*`)

### Step 2: Install dependencies

```bash
npm install zustand react-hook-form zod @hookform/resolvers lucide-react clsx
```

### Step 3: Copy the files

Copy every file from this folder into your fresh Next.js project, **replacing any existing files** of the same name. The folder structure matches exactly what your project should look like.

### Step 4: Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000` — you're live!

## Project structure

```
embellish/
├── app/
│   ├── layout.tsx              # Root layout + fonts + metadata
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles + Google Fonts import
│   ├── shop/page.tsx           # Product listing with filters
│   ├── product/[slug]/page.tsx # Product detail page
│   ├── cart/page.tsx           # Cart with promo code
│   ├── checkout/page.tsx       # 3-step checkout (Paystack stub)
│   ├── account/page.tsx        # User account + wishlist
│   └── about/page.tsx          # Brand story
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky navbar with cart/wishlist counters
│   │   └── Footer.tsx          # Footer with newsletter
│   └── shop/
│       └── ProductCard.tsx     # Reusable product card
├── lib/
│   └── data.ts                 # Products data + formatPrice helper
├── store/
│   └── index.ts                # Zustand cart + wishlist (persisted)
├── types/
│   └── index.ts                # TypeScript interfaces
├── tailwind.config.ts          # EMBELLISH brand colors
└── package.json
```

## Brand palette

| Name | Hex | Use |
|---|---|---|
| Plum | `#260C1A` | Primary dark, buttons, navbar text |
| Mauve | `#432E36` | Secondary dark, promo banner |
| Brown | `#5F4842` | Body text, icons |
| Taupe | `#AF8D86` | Accent, hover states |
| Blush | `#EDBFC6` | Light CTAs, text on dark |
| Cream | `#FAF5F2` | Page background |

## Features included

- Mobile-first responsive design
- Full cart with persistence (localStorage via Zustand)
- Wishlist with persistence
- Product filtering by category + sorting
- Price range filter
- Promo code (`EMBELLISH10` = 10% off)
- 3-step checkout flow
- Search bar (UI ready, hook up to backend)
- Account with profile/orders/wishlist tabs
- SEO metadata
- Naira (₦) currency formatting

## Next steps (production)

To take this from MVP to live store:

1. **Replace emoji product images with real photos** — drop images into `public/products/` and update `lib/data.ts`
2. **Connect Paystack** — see `app/checkout/page.tsx`, `handlePaystack` function has the integration point marked
3. **Set up Supabase** for products, orders, users (instead of mock data in `lib/data.ts`)
4. **Add Payload CMS** for the admin panel
5. **Deploy to Vercel** — `vercel deploy` from the project root

## Tech stack

- **Next.js 14** App Router
- **TypeScript**
- **Tailwind CSS** with custom brand colors
- **Zustand** for client-side state (cart + wishlist)
- **Lucide React** for icons
- **React Hook Form + Zod** ready (in checkout)
- **Cormorant Garamond + Jost** fonts via Google Fonts

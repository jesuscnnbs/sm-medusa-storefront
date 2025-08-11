# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Santa Monica Burgers restaurant website built with Next.js 15. It's a bilingual (Spanish/English) website with internationalization support, featuring menu display, reservations, and basic e-commerce structure (Medusa dependencies removed).

**Tech Stack:**
- Next.js 15 (App Router, Server Components, Server Actions)
- TypeScript
- Tailwind CSS + Medusa UI components (custom Santa Monica branding)
- Next-intl (internationalization)
- Framer Motion (animations)
- Stripe & PayPal (payments - ready to implement)
- Search capabilities (ready to implement)

## Development Commands

**Primary Development:**
- `npm run dev` or `yarn dev` - Start development server on port 8000 with turbopack
- `npm run build` or `yarn build` - Build for production
- `npm run start` or `yarn start` - Start production server on port 8000
- `npm run lint` or `yarn lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

**Important:** This project uses Yarn as the package manager (configured with `packageManager: "yarn@3.2.3"`).

## Architecture

### URL Structure
The application uses internationalized routing:
- `[locale]/(main)/*` - Main app routes
- `[locale]/(checkout)/*` - Checkout flow with different layout

Example URLs:
- `/es/menu` - Spanish menu
- `/en/products/burger-deluxe` - English product page

### Key Directories

**`/src/lib/`** - Core utilities and configuration
- `config.ts` - Configuration (simplified, ready for custom backend)
- `data/` - Server actions for API calls (simplified, ready for custom backend implementation)
- `context/` - React contexts
- `hooks/` - Custom React hooks
- `util/` - Utility functions

**`/src/modules/`** - Feature-based components organized by domain
- Each module contains `components/`, `templates/`, and sometimes `actions.ts`
- Examples: `home/`, `products/`, `cart/`, `checkout/`, `account/`

**`/src/i18n/`** - Internationalization setup
- `routing.ts` - Defines supported locales (`['en', 'es']`) with Spanish as default

### Data Layer
All API interactions use Server Actions in `/src/lib/data/`. These are currently simplified placeholder functions ready for your custom backend implementation:
- `cart.ts` - Cart operations (TODO: implement with your backend)
- `products.ts` - Product fetching (TODO: implement with your backend)
- `customer.ts` - User authentication (TODO: implement with your backend)
- `menu.ts` - Menu items (TODO: implement with your backend)

### Environment Setup
Currently no required environment variables. Ready to add your own:

Optional for payments (when ready to implement):
- `NEXT_PUBLIC_STRIPE_KEY`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

### Styling
- Uses Tailwind CSS with Medusa UI preset + custom Santa Monica branding
- Medusa UI components available (@medusajs/ui, @medusajs/icons)
- Custom Santa Monica colors and fonts (LemonMilk font family) 
- Dark mode support configured
- Custom animations for smooth user experience

### Internationalization
- Spanish is the default locale (`defaultLocale: 'es'`)
- Translation files in `/messages/` (en.json, es.json)
- Middleware handles locale/country routing and region detection
- Always shows locale prefix in URLs

## Development Notes

- **Medusa backend removed, UI components kept** - ready for custom backend implementation
- Uses React 19 RC with special type overrides
- TypeScript errors and ESLint warnings are ignored during builds (configured for rapid development)
- Server Components are used extensively with Server Actions for data mutations
- All data layer functions are placeholder implementations with TODO comments
- Routing simplified to use only locale (no countryCode)
- Project builds successfully with placeholder functions

## Migration Notes

This codebase has been refactored to remove Medusa v2 backend while keeping UI components:
- URL structure changed from `[locale]/[countryCode]` to `[locale]` 
- All `/src/lib/data/` files contain placeholder implementations with TODO comments
- Middleware simplified to handle only internationalization
- Medusa UI components (@medusajs/ui, @medusajs/icons) restored for styling
- Backend logic completely removed - ready for your custom API integration
- **Build now works successfully** with placeholder functions
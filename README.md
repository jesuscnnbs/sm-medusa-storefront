<h1 align="center">
  Santa Monica Burgers
</h1>

<p align="center">
A modern restaurant website built with Next.js 15, featuring bilingual support, menu management, and admin dashboard.</p>

### Security Mesaures implemented

- [x] Rate limiting for admin login
- [x] Secure session management with IP/User-Agent binding
- [x] Secure token generation using Web Crypto API
- [x] Session cleanup functionality
- [x] Database schema with proper constraints

Additional Security for Vercel:

  Environment Variables to Add:
  # Security
  NEXTAUTH_SECRET="your-random-secret-here"
  ADMIN_SESSION_SECRET="another-random-secret"
  NODE_ENV="production"

  # Optional: Rate limiting config
  RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
  RATE_LIMIT_MAX_ATTEMPTS="5"

  Vercel Security Headers (add to vercel.json):
  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ]
  }
  ```

  Additional Recommendations:
  1. Database Connection: Use connection pooling (already configured with
  @vercel/postgres)
  2. Admin Access: Consider adding 2FA for admin accounts
  3. Monitoring: Set up logging for security events
  4. Backup: Enable automatic database backups in Vercel
  5. Domain Security: Add your domain to Vercel's domain allowlist

# Overview

Santa Monica Burgers is built with:

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [PostgreSQL](https://www.postgresql.org/) - Robust relational database

## Features

- **Restaurant Management**:
  - Dynamic menu system with categories and items
  - Bilingual support (Spanish/English)
  - Admin dashboard for content management
  - Menu profile management (seasonal menus, special events)
  - Real-time menu updates

- **Security & Admin**:
  - Secure admin authentication
  - Session management with IP binding
  - Rate limiting for login attempts
  - Role-based access control

- **Modern Web Features**:
  - Server Components and Server Actions
  - Responsive design with mobile-first approach
  - SEO optimized with internationalization
  - Performance optimized with Next.js 15
  - Edge-ready with serverless database support


# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd nextjs-starter-medusa/
mv .env.template .env.local
```

### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)
- [Paypal](https://www.paypal.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
```

You will also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/add-plugins/stripe) and [PayPal](https://docs.medusajs.com/add-plugins/paypal) in your Medusa project.

# Search integration

This starter is configured to support using the `medusa-search-meilisearch` plugin out of the box. To enable search you will need to enable the feature flag in `./store.config.json`, which you do by changing the config to this:

```javascript
{
  "features": {
    // other features...
    "search": true
  }
}
```

Before you can search you will need to install the plugin in your Medusa server, for a written guide on how to do this – [see our documentation](https://docs.medusajs.com/add-plugins/meilisearch).

The search components in this starter are developed with Algolia's `react-instant-search-hooks-web` library which should make it possible for you to seemlesly change your search provider to Algolia instead of MeiliSearch.

To do this you will need to add `algoliasearch` to the project, by running

```shell
yarn add algoliasearch
```

After this you will need to switch the current MeiliSearch `SearchClient` out with a Alogolia client. To do this update `@lib/search-client`.

```ts
import algoliasearch from "algoliasearch/lite"

const appId = process.env.NEXT_PUBLIC_SEARCH_APP_ID || "test_app_id" // You should add this to your environment variables

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

export const searchClient = algoliasearch(appId, apiKey)

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"
```

Then, in `src/app/(main)/search/actions.ts`, remove the MeiliSearch code (line 10-16) and uncomment the Algolia code.

```ts
"use server"

import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"

/**
 * Uses MeiliSearch or Algolia to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  const index = searchClient.initIndex(SEARCH_INDEX_NAME)
  const { hits } = await index.search(query)

  return hits
}
```

After this you will need to set up Algolia with your Medusa server, and then you should be good to go. For a more thorough walkthrough of using Algolia with Medusa – [see our documentation](https://docs.medusajs.com/add-plugins/algolia), and the [documentation for using `react-instantsearch-hooks-web`](https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/).

## App structure

For the new version, the main folder structure remains unchanged. The contents have changed quite a bit though.

```
.
└── src
    ├── app
    ├── lib
    ├── modules
    ├── styles
    ├── types
    └── middleware.ts

```

### `/app` directory

The app folder contains all Next.js App Router pages and layouts, and takes care of the routing.

```
.
└── [countryCode]
    ├── (checkout)
        └── checkout
    └── (main)
        ├── account
        │   ├── addresses
        │   └── orders
        │       └── details
        │           └── [id]
        ├── cart
        ├── categories
        │   └── [...category]
        ├── collections
        │   └── [handle]
        ├── order
        │   └── confirmed
        │       └── [id]
        ├── products
        │   └── [handle]
        ├── results
        │   └── [query]
        ├── search
        └── store
```

The app router folder structure represents the routes of the Starter. In this case, the structure is as follows:

- The root directory is represented by the `[countryCode]` folder. This indicates a dynamic route based on the country code. The this will be populated by the countries you set up in your Medusa server. The param is then used to fetch region specific prices, languages, etc.
- Within the root directory, there two Route Groups: `(checkout)` and `(main)`. This is done because the checkout flow uses a different layout.  All other parts of the app share the same layout and are in subdirectories of the `(main)` group. Route Groups do not affect the url.
- Each of these subdirectories may have further subdirectories. For instance, the `account` directory has `addresses` and `orders` subdirectories. The `orders` directory further has a `details` subdirectory, which itself has a dynamic `[id]` subdirectory.
- This nested structure allows for specific routing to various pages within the application. For example, a URL like `/account/orders/details/123` would correspond to the `account > orders > details > [id]` path in the router structure, with `123` being the dynamic `[id]`.

This structure enables efficient routing and organization of different parts of the Starter.

### `/lib` **directory**

The lib directory contains all utilities like the Medusa JS client functions, util functions, config and constants. 

The most important file here is `/lib/data/index.ts`. This file defines various functions for interacting with the Medusa API, using the JS client. The functions cover a range of actions related to shopping carts, orders, shipping, authentication, customer management, regions, products, collections, and categories. It also includes utility functions for handling headers and errors, as well as some functions for sorting and transforming product data.

These functions are used in different Server Actions.

### `/modules` directory

This is where all the components, templates and Server Actions are, grouped by section. Some subdirectories have an `actions.ts` file. These files contain all Server Actions relevant to that section of the app.

### `/styles` directory

`global.css` imports Tailwind classes and defines a couple of global CSS classes. Tailwind and Medusa UI classes are used for styling throughout the app.

### `/types` directory

Contains global TypeScript type defintions.

### `middleware.ts`

Next.js Middleware handles internationalization and security. It enforces a `locale` in the URL and includes security features like rate limiting and session validation.

## API Documentation

This section documents the available APIs and Server Actions for the Santa Monica Burgers restaurant application.

### Admin Authentication APIs

#### Server Actions
- **`adminLogin(prevState, formData)`** - Authenticates admin users
  - **Parameters**: FormData with email and password
  - **Returns**: Error message on failure, redirects to `/es/admin/dashboard` on success
  - **Security**: Rate limited, IP tracking

- **`adminLogout(formData?)`** - Logs out admin users
  - **Parameters**: Optional FormData
  - **Returns**: Redirects to `/es/admin/login`
  - **Security**: Clears session, invalidates tokens

- **`getAdminUser()`** - Gets current authenticated admin
  - **Returns**: Admin user object or null
  - **Security**: Session validation, IP binding check

### Menu Management APIs

#### Database Statistics
- **`getDashboardStats()`** - Get dashboard statistics
  - **Returns**: Object with menu counts
    ```typescript
    {
      menuItemsCount: number,
      categoriesCount: number, 
      activeCategoriesCount: number,
      menuProfilesCount: number
    }
    ```

#### Menu Items
- **`listMenuItems(locale?, query?)`** - Get menu items by locale
  - **Parameters**: 
    - `locale`: 'en' | 'es' (default: 'es')
    - `query`: Optional filter parameters
  - **Returns**: Array of `MenuCategoryType[]`
  - **Features**: Internationalization, category grouping, sorting

#### Categories
- **`listMenuCategories()`** - Get all menu categories
  - **Returns**: Array of category objects with bilingual support
  - **Fields**: id, name, nameEn, description, descriptionEn, image, sortOrder, isActive

#### Menu Profiles
- **`listMenuProfiles()`** - Get all menu profiles/configurations
  - **Returns**: Array of menu profile objects
  - **Use Case**: Multiple menu configurations (seasonal, special events)

### Database API Routes

#### Health Check
- **`GET /api/test-db`** - Test database connectivity
  - **Returns**: JSON response with connection status
  - **Response Format**:
    ```typescript
    {
      success: boolean,
      message: string,
      error?: string
    }
    ```

### Database Schema

The application uses PostgreSQL with Drizzle ORM. Key tables include:

#### Admin Tables
- **`admin_users`** - Admin user accounts with roles and status
- **`admin_sessions`** - Secure session management with IP/User-Agent binding
- **`rate_limiting`** - Rate limiting tracking for security

#### Menu Tables
- **`menu_profiles`** - Menu configurations (default, seasonal, special)
- **`menu_categories`** - Menu categories with bilingual support
- **`menu_items`** - Menu items with pricing, ingredients, allergens
- **`site_settings`** - Dynamic site configuration

### Security Features

#### Authentication
- Secure session management with IP and User-Agent binding
- Cryptographically secure token generation
- Automatic session cleanup and expiration

#### Rate Limiting
- IP-based and email-based login attempt limiting  
- Configurable time windows and attempt limits
- Automatic lockout functionality

#### Data Protection
- Input validation and sanitization
- SQL injection prevention via Drizzle ORM
- Secure password hashing with bcrypt

### Environment Configuration

#### Required Variables
```bash
# Database
POSTGRES_URL="your-database-url"
DATABASE_URL="your-database-url"

# Security (recommended for production)
NEXTAUTH_SECRET="your-random-secret"
ADMIN_SESSION_SECRET="another-random-secret"
NODE_ENV="production"
```

#### Optional Variables
```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_ATTEMPTS="5"

# Payments (when ready)
NEXT_PUBLIC_STRIPE_KEY="your-stripe-key"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-id"
```

## Database Setup & Migrations

This project uses PostgreSQL with Drizzle ORM for database management. The setup is configured to work with both local PostgreSQL and remote databases (Neon for production).

### Local Development Setup

#### 1. Install PostgreSQL
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Create database
createdb santa_monica_db
```

#### 2. Configure Environment Variables
Create `.env.local` for local development:
```bash
# Database Configuration for Local Development
DATABASE_URL="postgresql://user:pass@localhost:5432/santa_monica_db"
POSTGRES_URL="postgresql://user:pass@localhost:5432/santa_monica_db"

# Admin Authentication
ADMIN_JWT_SECRET="your-local-jwt-secret-change-this"

# Development URLs
NEXT_PUBLIC_BASE_URL="http://localhost:8000"
```

**Note:** Replace `user` with your actual PostgreSQL username.

#### 3. Run Initial Migration
```bash
# Install dependencies
npm install

# Generate and apply database schema
npm run db:generate  # Generate migration files
npm run db:push      # Apply migrations to local database

# Test connection
npm run db:test      # Verify database connectivity
```

### Production Setup (Neon Database)

#### 1. Configure Environment Variables
Create `.env` or update `.env.production`:
```bash
# Production Database (Neon)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
POSTGRES_URL="postgresql://username:password@host:port/database?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:port/database?sslmode=require"

# Security (required for production)
NEXTAUTH_SECRET="your-production-secret"
ADMIN_SESSION_SECRET="another-production-secret"
NODE_ENV="production"
```

#### 2. Run Production Migration
```bash
# Push schema to production database
npm run db:push-prod

# Or use Neon-specific script
npm run db:push-neon
```

### Database Commands Reference

#### Local Development
```bash
# Schema Operations
npm run db:generate    # Generate migration files from schema changes
npm run db:push        # Apply schema changes to LOCAL database
npm run db:studio      # Open Drizzle Studio for LOCAL database

# Testing & Seeding
npm run db:test        # Test LOCAL database connection
npm run db:seed        # Seed LOCAL database with sample data
```

#### Production/Neon
```bash
# Production Operations  
npm run db:push-prod   # Apply schema changes to PRODUCTION database
npm run db:push-neon   # Apply schema changes via Neon script
npm run db:studio-neon # Open Drizzle Studio for NEON database

# Testing & Seeding
npm run db:test-neon   # Test NEON database connection
npm run db:seed-neon   # Seed NEON database with sample data
```

### Migration Workflow

#### Making Schema Changes
1. **Modify schema** in `src/lib/db/schema.ts`
2. **Generate migration** (creates migration files):
   ```bash
   npm run db:generate
   ```
3. **Apply to local database**:
   ```bash
   npm run db:push
   ```
4. **Test changes locally**:
   ```bash
   npm run db:test
   npm run dev
   ```
5. **Deploy to production**:
   ```bash
   npm run db:push-prod
   ```

#### Database Connection Logic
The application automatically selects the appropriate database driver:
- **Local Development**: Uses `node-postgres` driver with connection pooling
- **Production/Vercel**: Uses `@neondatabase/serverless` driver for edge compatibility

### Troubleshooting

#### Common Issues
1. **Migration not applied locally**: Ensure you're using the local database commands (`npm run db:push` not `npm run db:push-prod`)
2. **Connection refused**: Check PostgreSQL is running and database exists
3. **Permission denied**: Verify PostgreSQL user permissions
4. **Schema conflicts**: Use `npm run db:studio` to inspect current schema

#### Reset Local Database
```bash
# Drop and recreate database
dropdb santa_monica_db
createdb santa_monica_db
npm run db:push
npm run db:seed
```

### Development Commands

```bash
# Database operations (see above for detailed commands)
npm run db:test      # Test database connection
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with sample data

# Development
npm run dev          # Start dev server on port 8000
npm run build        # Build for production
npm run lint         # Run ESLint
```

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)

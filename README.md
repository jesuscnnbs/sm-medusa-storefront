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

## Admin Management System

The admin dashboard provides comprehensive management for your restaurant's menu and content.

### Categories Management (`/admin/categories`)

Organize your menu items into categories with full CRUD operations:

**Features:**
- Create, read, update, and delete categories
- Bilingual support (Spanish/English names and descriptions)
- Image URL support with preview
- Active/inactive status toggle
- Sort order management
- Real-time category status updates

**Available Pages:**
- **List View** (`/admin/categories`) - View all categories with quick actions
- **Create** (`/admin/categories/create`) - Add new category
- **Detail/Edit** (`/admin/categories/[id]`) - View and edit category details

**Category Fields:**
- Name (Spanish/English)
- Description (Spanish/English)
- Image URL
- Sort order
- Active status
- Creation and update timestamps

### Dish Management (`/admin/dish`)

Manage your restaurant's menu items with comprehensive details:

**Features:**
- Complete CRUD operations for dishes
- Bilingual support (Spanish/English)
- Price management (stored in cents)
- Category assignment
- Image URL with preview
- Availability toggle
- Popular/featured dish marking
- Ingredients list (comma-separated)
- Allergens information
- Nutritional details support
- Sort order within categories

**Available Pages:**
- **List View** (`/admin/dish`) - View all dishes with filtering
- **Create** (`/admin/dish/create`) - Add new dish
- **Detail/Edit** (`/admin/dish/[id]`) - View and edit dish details

**Dish Fields:**
- Name (Spanish/English)
- Description (Spanish/English)
- Price (in cents, displayed as currency)
- Category assignment
- Image URL
- Ingredients (array)
- Allergens (array)
- Availability status
- Popular flag
- Sort order
- Creation and update timestamps

**Quick Actions:**
- Toggle dish availability from list view
- Delete dishes with confirmation
- Navigate between related sections (Categories, Menus)

### Menu Profile Management (`/admin/menu`)

Create and manage different menu configurations:

**Features:**
- Multiple menu profiles (seasonal, special events, default)
- Active menu switching (only one active at a time)
- Date-based validity periods
- Menu item selection and ordering
- Bilingual support

**Use Cases:**
- Regular menu
- Seasonal menus (summer, winter)
- Special event menus
- Holiday menus
- Limited-time offers

# Quickstart

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd santa-monica-burgers
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your database credentials:
```bash
DATABASE_URL="postgresql://user:@localhost:5432/santa_monica_db"
ADMIN_JWT_SECRET="your-secret-key"
```

4. **Set up database**
```bash
# Create database
createdb santa_monica_db

# Run migrations
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

### **🎭 Run playwrigth Tests**
```bash
npx playwright test --ui
```

Your site is now running at http://localhost:8000!

# Payment integrations (Ready for Implementation)

The project structure is ready to support the following payment integrations:

- [Stripe](https://stripe.com/)
- [PayPal](https://www.paypal.com/)

To enable payments when ready, add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
```

The payment components are already configured in the codebase but require backend API implementation.

# Search integration (Ready for Implementation)

The project structure includes search capabilities that can be implemented with:

- [MeiliSearch](https://www.meilisearch.com/)
- [Algolia](https://www.algolia.com/)

Search components are built with Algolia's `react-instant-search-hooks-web` library for flexibility.

## To enable search:

1. **Choose your search provider and install:**
```bash
# For Algolia
npm install algoliasearch

# For MeiliSearch  
npm install @meilisearch/instant-meilisearch
```

2. **Configure environment variables:**
```bash
# Add to .env.local
NEXT_PUBLIC_SEARCH_ENABLED=true
NEXT_PUBLIC_SEARCH_APP_ID=your-app-id
NEXT_PUBLIC_SEARCH_API_KEY=your-api-key
NEXT_PUBLIC_INDEX_NAME=menu_items
```

3. **Update search client configuration** in `@lib/search-client`

The search functionality is ready to index menu items, categories, and other restaurant content.

# Project Structure

```
.
└── src
    ├── app                 # Next.js App Router pages and layouts
    ├── lib                 # Core utilities, database, and configurations
    ├── modules             # Feature-based components and templates
    ├── styles              # Global styles and Tailwind CSS
    ├── types               # TypeScript type definitions
    └── middleware.ts       # Internationalization and security middleware
```

## `/app` Directory

The app folder contains all Next.js App Router pages with internationalization support:

```
.
└── [locale]                # Dynamic locale routing (es, en)
    ├── (checkout)          # Checkout flow with separate layout
    │   └── checkout
    └── (main)              # Main application routes
        ├── admin           # Admin dashboard and management
        │   ├── dashboard
        │   ├── menu
        │   ├── categories
        │   └── login
        ├── menu            # Public menu pages
        ├── reservations    # Reservation system
        └── about           # About and contact pages
```

### Route Structure

- **`[locale]`** - Dynamic routing for internationalization (Spanish: `es`, English: `en`)
- **Route Groups** - `(checkout)` and `(main)` use different layouts without affecting URLs
- **Admin Routes** - Protected admin interface for content management
- **Public Routes** - Customer-facing pages with bilingual support

Example URLs:
- `/es/menu` - Spanish menu page
- `/en/admin/dashboard` - English admin dashboard
- `/es/admin/menu/create` - Create new menu (Spanish interface)

## `/lib` Directory

Core utilities and configurations for the application:

```
lib/
├── db/                     # Database layer
│   ├── index.ts           # Database connection and configuration
│   ├── schema.ts          # Drizzle ORM schema definitions
│   ├── queries/           # Database queries organized by feature
│   └── migrations/        # Database migration files
├── data/                  # Server Actions for API interactions
├── context/               # React contexts
├── hooks/                 # Custom React hooks
├── util/                  # Utility functions
└── config.ts             # Application configuration
```

### Key Files

- **`/lib/db/schema.ts`** - Defines database tables and relationships using Drizzle ORM
- **`/lib/db/queries/`** - Organized database queries (menu items, categories, admin users, etc.)
- **`/lib/data/`** - Server Actions for data fetching and mutations
- **`/lib/config.ts`** - Application configuration and constants

## `/modules` Directory

Feature-based components organized by domain:

```
modules/
├── admin/                  # Admin dashboard components
│   ├── components/        # Reusable admin components
│   │   ├── category-form/         # Category create/edit form
│   │   ├── dish-form/             # Dish create/edit form
│   │   ├── menu-profile-form/     # Menu profile form
│   │   ├── menu-item-selector/    # Multi-select for menu items
│   │   ├── admin-login/           # Admin authentication form
│   │   ├── side-menu/             # Admin navigation sidebar
│   │   ├── submit-button/         # Form submit button
│   │   ├── error-message/         # Error display component
│   │   └── stat/                  # Dashboard statistics card
│   └── templates/         # Admin page templates
│       └── nav/                   # Admin navigation template
├── home/                  # Homepage components
├── menu/                  # Menu display components
├── layout/                # Layout components (header, footer)
└── common/                # Shared components across features
```

### Admin Components

**Form Components:**
- **`CategoryForm`** - Handles category creation and editing with bilingual fields
- **`DishForm`** - Complete form for menu item management with all fields
- **`MenuProfileForm`** - Form for menu profile configuration and item selection
- **`MenuItemSelector`** - Multi-select component for assigning items to menu profiles

**UI Components:**
- **`AdminLogin`** - Secure login form with rate limiting
- **`SideMenu`** - Responsive sidebar navigation for admin dashboard
- **`SubmitButton`** - Loading-aware form submission button
- **`ErrorMessage`** - Consistent error display component
- **`Stat`** - Dashboard statistics card component

Each module contains components and templates relevant to that feature area.

## `/styles` Directory

- **`global.css`** - Imports Tailwind CSS and defines global styles
- **Custom styling** - Uses Tailwind CSS with Medusa UI components
- **Santa Monica branding** - Custom colors and LemonMilk font family

## `/types` Directory

Global TypeScript type definitions for the application.

## `middleware.ts`

Next.js Middleware that handles:
- **Internationalization** - Enforces locale in URLs (`/es/`, `/en/`)
- **Security** - Rate limiting and session validation
- **Region detection** - Automatic locale detection based on headers

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

#### Categories Management

**Query Functions** (`src/lib/db/queries/menu-categories.ts`):

- **`createMenuCategory(data)`** - Create new category
  - **Parameters**: Category data object
  - **Returns**: Created category object
  - **Fields**: name, nameEn, description, descriptionEn, image, sortOrder, isActive

- **`listMenuCategories()`** - Get all categories
  - **Returns**: Array of all categories (active and inactive)
  - **Sorting**: By sortOrder, then by name

- **`getMenuCategoryById(id)`** - Get category by ID
  - **Parameters**: Category UUID
  - **Returns**: Single category object or null

- **`updateMenuCategory(id, data)`** - Update category
  - **Parameters**: Category ID and partial data object
  - **Returns**: Updated category object

- **`toggleMenuCategoryActive(id)`** - Toggle active status
  - **Parameters**: Category UUID
  - **Returns**: Updated category with toggled status

- **`deleteMenuCategory(id)`** - Soft delete (set inactive)
  - **Parameters**: Category UUID
  - **Returns**: Updated category object

- **`hardDeleteMenuCategory(id)`** - Permanently delete category
  - **Parameters**: Category UUID
  - **Returns**: Deleted category object

#### Dish (Menu Items) Management

**Query Functions** (`src/lib/db/queries/menu-items.ts`):

- **`createMenuItem(data)`** - Create new menu item
  - **Parameters**: Menu item data object
  - **Returns**: Created menu item object
  - **Fields**: name, nameEn, description, descriptionEn, price (cents), categoryId, image, isAvailable, isPopular, ingredients[], allergens[], sortOrder

- **`getAllMenuItems()`** - Get all menu items with categories
  - **Returns**: Array of menu items with joined category data
  - **Includes**: Category information for each item

- **`getMenuItemById(id)`** - Get menu item by ID
  - **Parameters**: Menu item UUID
  - **Returns**: Single menu item with category details

- **`updateMenuItem(id, data)`** - Update menu item
  - **Parameters**: Menu item ID and partial data object
  - **Returns**: Updated menu item object

- **`deleteMenuItem(id)`** - Permanently delete menu item
  - **Parameters**: Menu item UUID
  - **Returns**: Deleted menu item object

- **`toggleMenuItemAvailability(id)`** - Toggle availability status
  - **Parameters**: Menu item UUID
  - **Returns**: Updated menu item with toggled availability

- **`getMenuItemsByCategory(categoryId)`** - Get items by category
  - **Parameters**: Category UUID
  - **Returns**: Array of menu items in that category

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
  - Fields: name, nameEn, description, descriptionEn, validFrom, validTo, isActive, isDefault, sortOrder

- **`menu_categories`** - Menu categories with bilingual support
  - Fields: name, nameEn, description, descriptionEn, image, sortOrder, isActive, timestamps

- **`menu_items`** - Menu items with pricing, ingredients, allergens
  - Fields: name, nameEn, description, descriptionEn, price (cents), categoryId, image, isAvailable, isPopular, ingredients[], allergens[], nutritionalInfo, sortOrder, timestamps

- **`menu_profile_items`** - Junction table for menu profiles and items
  - Fields: menuProfileId, menuItemId, sortOrder

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

## Learn more about the technologies

- **Next.js 15** - [Website](https://nextjs.org/) | [Documentation](https://nextjs.org/docs)
- **Drizzle ORM** - [Website](https://orm.drizzle.team/) | [Documentation](https://orm.drizzle.team/docs/overview)
- **Tailwind CSS** - [Website](https://tailwindcss.com/) | [Documentation](https://tailwindcss.com/docs)
- **PostgreSQL** - [Website](https://www.postgresql.org/) | [Documentation](https://www.postgresql.org/docs/)
- **TypeScript** - [Website](https://www.typescriptlang.org/) | [Documentation](https://www.typescriptlang.org/docs/)

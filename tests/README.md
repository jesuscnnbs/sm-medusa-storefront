# E2E Testing with Mock Database

This directory contains Playwright E2E tests for the Santa Monica Burgers website.

## Database Setup for Tests

### Architecture

The tests use a **real PostgreSQL database** (not mocked) with the following setup:

1. **Global Setup** (`tests/global-setup.ts`)
   - Runs once before all tests
   - Seeds the database with test data
   - Ensures consistent test state

2. **Database Helpers** (`tests/helpers/database.ts`)
   - Utility functions to manipulate database state during tests
   - Allows testing edge cases (empty menus, unavailable items, etc.)
   - Safe cleanup/restoration functions

3. **Seed Script** (`scripts/seed.js`)
   - Populates database with sample menu items, categories, and profiles
   - Creates admin user for admin panel testing
   - Can be run manually: `npm run db:seed`

### Database Connection

Tests connect to the database specified in your `.env.local` file:

```bash
# Option 1: Local PostgreSQL (development)
DATABASE_URL="postgresql://user:@localhost:5432/santa_monica_db"

# Option 2: Neon Database (same as production)
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## Test Data

The seed script creates:
- **1 Menu Profile**: "Menú Principal" (Main Menu) - Active by default
- **4 Categories**: Hamburguesas Clásicas, Hamburguesas Gourmet, Acompañamientos, Bebidas
- **8 Menu Items**: Various burgers, sides, and drinks with bilingual names
- **1 Admin User**: admin@santamonica.com / admin123
- **5 Site Settings**: Restaurant info (name, phone, address, hours)

## Running Tests

### Run all tests with UI
```bash
npm test
```

### Run tests in headless mode (CI)
```bash
npm run test:headless
```

### Run specific test file
```bash
npx playwright test tests/menu-page.spec.ts
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Examples

### Testing Normal State (Menu Items Visible)
```typescript
test('should display menu items', async ({ page }) => {
  await page.goto('/es/menu');
  const menuItems = page.locator('h3.text-md');
  await expect(menuItems.first()).toBeVisible();
});
```

### Testing Empty State (Coming Soon)
```typescript
import { deactivateAllMenuProfiles, activateDefaultMenuProfile } from './helpers/database';

test('should display Coming Soon when no items exist', async ({ page }) => {
  // Temporarily deactivate menu
  await deactivateAllMenuProfiles();

  try {
    await page.goto('/es/menu');
    const comingSoon = page.getByText(/Próximamente|Coming soon/i);
    await expect(comingSoon).toBeVisible();
  } finally {
    // Always restore state for other tests
    await activateDefaultMenuProfile();
  }
});
```

## Database Helper Functions

Available in `tests/helpers/database.ts`:

| Function | Description |
|----------|-------------|
| `deactivateAllMenuProfiles()` | Hide all menu items (shows Coming Soon) |
| `activateDefaultMenuProfile()` | Restore the default menu profile |
| `clearAllMenuItems()` | Delete all menu profile associations |
| `restoreMenuItems()` | Re-run seed script to restore data |
| `markAllMenuItemsUnavailable()` | Set all items to unavailable |
| `markAllMenuItemsAvailable()` | Set all items to available |
| `getActiveMenuProfilesCount()` | Count active menu profiles |
| `getAvailableMenuItemsCount()` | Count available menu items |

## Best Practices

1. **Always Restore State**: Use `try...finally` blocks when manipulating database state
   ```typescript
   try {
     await deactivateAllMenuProfiles();
     // ... test logic
   } finally {
     await activateDefaultMenuProfile();
   }
   ```

2. **Use beforeEach for Common Setup**: The tests already dismiss cookie banners
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.addInitScript(() => {
       localStorage.setItem('santa_monica_cookie_consent', 'accepted');
     });
   });
   ```

3. **Wait for Hydration**: Client components need time to hydrate
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.waitForTimeout(1000); // For complex interactions
   ```

4. **Parallel Testing**: Tests run in parallel - ensure they don't conflict
   - Avoid modifying global state without restoration
   - Use isolated test data when possible

## Troubleshooting

### Tests fail with "net::ERR_CONNECTION_REFUSED"
- Ensure the dev server is running: `npm run dev`
- Check `playwright.config.ts` has correct `webServer` config

### Database connection errors
- Verify `DATABASE_URL` in `.env.local`
- Run `npm run db:test` to check connection
- For Neon: Ensure connection string includes `?sslmode=require`

### Seed script fails
- Run `npm run db:push` to ensure schema is up to date
- Check PostgreSQL is running (local) or Neon connection is valid
- Manually test: `npm run db:seed`

### Tests are flaky
- Increase timeout for slow operations
- Use `networkidle` wait strategy for data-dependent pages
- Check for race conditions in database helpers

## CI/CD Integration

The tests are CI-ready:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm ci

- name: Setup database
  run: npm run db:push

- name: Run tests
  run: npm run test:headless
```

The Playwright config automatically:
- Starts the dev server before tests
- Runs with 1 worker on CI (sequential)
- Retries failed tests 2 times on CI
- Uses headless browsers on CI

## Test Coverage

Current test suites:

- ✅ **Menu Page** (`menu-page.spec.ts`)
  - Spanish/English locales
  - Menu item display
  - Modal interactions
  - Coming Soon state
  - Responsive design (mobile/tablet)
  - Internationalization

- 📝 **Additional test files** (add your own)
  - Admin panel tests
  - Checkout flow
  - Product pages
  - etc.

---

**Note**: These tests use a real database. For production CI, consider using a separate test database or database snapshots to avoid conflicts with development data.

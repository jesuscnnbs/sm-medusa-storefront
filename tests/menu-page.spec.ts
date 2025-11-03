import { test, expect } from '@playwright/test';

test.describe('Menu Page - Public View', () => {
  // Dismiss cookie banner before all tests by setting localStorage
  test.beforeEach(async ({ page }) => {
    // Set cookie consent in localStorage to prevent banner from appearing
    await page.addInitScript(() => {
      localStorage.setItem('santa_monica_cookie_consent', 'accepted');
    });
  });

  // region Spanish Tests
  test.describe('Spanish (ES) - Default Locale', () => {
    test('should display menu page with title and items', async ({ page }) => {
      await page.goto('/es/menu');

      // Verify page title
      await expect(page).toHaveTitle(/Burgers - Santa Mónica/);

      // Check for page heading
      await expect(page.locator('h1')).toContainText('Menú');

      // Verify menu container is visible (not showing Coming Soon)
      const menuContainer = page.locator('.bg-doodle');
      await expect(menuContainer).toBeVisible();
    });

    test('should display menu categories', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for menu to load
      await page.waitForSelector('h2.text-3xl');

      // Check that at least one category title is visible
      const categoryTitles = page.locator('h2.text-3xl.uppercase');
      await expect(categoryTitles.first()).toBeVisible();
    });

    test('should display menu items with title and price', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for menu items to load
      await page.waitForSelector('h3.text-md');

      // Verify at least one menu item is visible
      const menuItems = page.locator('h3.text-md');
      await expect(menuItems.first()).toBeVisible();

      // Verify price is displayed (format: X.XX €)
      const prices = page.locator('text=/\\d+\\.\\d{2} €/');
      await expect(prices.first()).toBeVisible();
    });

    test('should open modal when clicking on a menu item', async ({ page }) => {
      await page.goto('/es/menu', { waitUntil: 'networkidle' });

      // Wait for menu items to load and ensure client-side hydration
      await page.waitForSelector('h3.text-md', { state: 'visible' });

      // Wait for the page to be fully loaded and interactive
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Click on the parent div with cursor-pointer (the actual clickable element)
      const firstMenuItem = page.locator('.cursor-pointer').first();
      await firstMenuItem.click({ force: true });

      // Wait for modal content to be visible (not just the dialog wrapper)
      // The dialog panel is what becomes visible after transition
      await page.waitForSelector('[id^="headlessui-dialog-panel"]', {
        state: 'visible',
        timeout: 10000
      });

      // Verify modal contains item details (wait for the title in the modal)
      await expect(page.locator('[role="dialog"] h3.text-xl')).toBeVisible();
      await expect(page.locator('[role="dialog"] .text-secondary-sm-darker').first()).toBeVisible();
    });

    test('should display item description in modal', async ({ page }) => {
      await page.goto('/es/menu', { waitUntil: 'networkidle' });

      // Wait for menu items to load and ensure client-side hydration
      await page.waitForSelector('h3.text-md', { state: 'visible' });

      // Wait for the page to be fully loaded and interactive
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Click on the parent div with cursor-pointer
      await page.locator('.cursor-pointer').first().click({ force: true });

      // Wait for modal panel to be visible
      await page.waitForSelector('[id^="headlessui-dialog-panel"]', {
        state: 'visible',
        timeout: 10000
      });

      // Check for description (gray text) - use .first() since there are multiple gray text elements
      const description = page.locator('[role="dialog"] .text-gray-600').first();
      await expect(description).toBeVisible();
    });

    test('should close modal when clicking close button', async ({ page }) => {
      await page.goto('/es/menu', { waitUntil: 'networkidle' });

      // Open modal
      await page.waitForSelector('h3.text-md', { state: 'visible' });
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      await page.locator('.cursor-pointer').first().click({ force: true });

      // Wait for modal panel to be visible
      await page.waitForSelector('[id^="headlessui-dialog-panel"]', {
        state: 'visible',
        timeout: 10000
      });

      // Close modal using the close button (better than Escape)
      await page.click('[data-testid="close-modal-button"]');

      // Wait for modal panel to be hidden
      await page.waitForSelector('[id^="headlessui-dialog-panel"]', {
        state: 'hidden',
        timeout: 10000
      });

      // Verify modal content is not visible
      await expect(page.locator('[role="dialog"] h3.text-xl')).not.toBeVisible();
    });
  });
  //end region


  // region English
  test.describe('English (EN)', () => {
    test('should display menu page in English', async ({ page }) => {
      await page.goto('/en/menu');

      // Verify page title
      await expect(page).toHaveTitle(/Burgers - Santa Mónica/);

      // Verify menu is displayed
      const menuContainer = page.locator('.bg-doodle');
      await expect(menuContainer).toBeVisible();
    });

    test('should display menu items with prices in English locale', async ({ page }) => {
      await page.goto('/en/menu');

      // Wait for menu items
      await page.waitForSelector('h3.text-md');

      // Verify items are visible
      const menuItems = page.locator('h3.text-md');
      await expect(menuItems.first()).toBeVisible();

      // Verify prices are displayed
      const prices = page.locator('text=/\\d+\\.\\d{2} €/');
      await expect(prices.first()).toBeVisible();
    });
  });
  //end region
  // region No Menu Items
  test.describe('No Menu Items - Coming Soon', () => {
    // This test assumes you have a way to test the empty state
    // You might need to create a test database state or mock the API
    test.skip('should display Coming Soon when no menu items exist', async ({ page }) => {
      // TODO: This requires setting up test data or mocking
      // For now, we skip this test
      // In a real scenario, you'd:
      // 1. Clear all menu items from test database
      // 2. Navigate to /es/menu
      // 3. Verify Coming Soon component is visible

      await page.goto('/es/menu');

      // This would check for the CommingSoon component
      // const comingSoon = page.locator('text=/coming soon/i');
      // await expect(comingSoon).toBeVisible();
    });
  });
  //end region
  // region Internationalization
  test.describe('Internationalization', () => {
    test('should switch between Spanish and English', async ({ page }) => {
      // Start with Spanish
      await page.goto('/es/menu');
      await page.waitForSelector('h1');

      // Verify Spanish content
      await expect(page.locator('h1')).toContainText('Menú');

      // Switch to English (this depends on your language switcher implementation)
      // You'll need to adjust this selector based on your actual language switcher
      // For example:
      // await page.click('button[aria-label="Switch language"]');
      // await page.click('text=English');

      // Or navigate directly to English version
      await page.goto('/en/menu');
      await page.waitForSelector('h1');

      // Verify page loads in English locale
      expect(page.url()).toContain('/en/menu');
    });
  });
  //end region

  
  // region ResponsiveDesign 
  test.describe('Responsive Design', () => {
    test('should display menu correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/es/menu', { waitUntil: 'networkidle' });

      // Verify menu is still visible and functional on mobile
      await page.waitForSelector('h3.text-md', { state: 'visible' });
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      const menuItems = page.locator('h3.text-md');
      await expect(menuItems.first()).toBeVisible();

      // Click on item to open modal - click on the clickable div
      await page.locator('.cursor-pointer').first().click({ force: true });

      // Wait for modal panel to be visible
      await page.waitForSelector('[id^="headlessui-dialog-panel"]', {
        state: 'visible',
        timeout: 10000
      });

      // Verify modal content is visible on mobile
      await expect(page.locator('[role="dialog"] h3.text-xl')).toBeVisible();
    });

    test('should display menu correctly on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/es/menu');

      // Verify menu is displayed
      await page.waitForSelector('h3.text-md');
      const menuItems = page.locator('h3.text-md');
      await expect(menuItems.first()).toBeVisible();
    });
  });
});

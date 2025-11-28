import { test, expect } from '@playwright/test';
import {
  deactivateAllMenuProfiles,
  activateDefaultMenuProfile,
  getActiveMenuProfilesCount
} from './helpers/database';

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
        timeout: 30000
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
      await page.waitForTimeout(10000);
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

  //end region
  // region Internationalization
  test.describe('Internationalization', () => {
    test('should switch between Spanish and English', async ({ page }) => {
      // Start with Spanish
      await page.goto('/es/menu');
      await page.waitForSelector('h1');

      // Verify Spanish content
      expect(page.url()).toContain('/es/menu');

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
      await page.waitForSelector('h3.text-md', { state: 'attached' });
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(10000);
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
  //end region

  // region Menu Categories Navigation
  test.describe('Menu Categories Navigation', () => {
    test('should display categories navigation bar', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for navigation to load
      const categoryNav = page.locator('[data-testid="menu-categories-nav"]');
      await expect(categoryNav).toBeVisible();

      // Verify navigation contains category buttons
      const categoryButtons = categoryNav.locator('button');
      await expect(categoryButtons.first()).toBeVisible();

      // Check that multiple categories are present
      const buttonCount = await categoryButtons.count();
      expect(buttonCount).toBeGreaterThan(0);
    });

    test('should display all menu categories in navigation', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for navigation to load
      const categoryNav = page.locator('[data-testid="menu-categories-nav"]');
      await expect(categoryNav).toBeVisible();

      // Get all category titles from the page content
      const contentCategories = page.locator('h2.text-3xl.uppercase');
      const contentCount = await contentCategories.count();

      // Get all category buttons in navigation
      const navButtons = categoryNav.locator('button');
      const navCount = await navButtons.count();

      // Navigation should have same number of categories as content
      expect(navCount).toBe(contentCount);
    });

    test('should scroll to category when clicking navigation button', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for navigation and content to load
      const categoryNav = page.locator('[data-testid="menu-categories-nav"]');
      await expect(categoryNav).toBeVisible();
      await page.waitForSelector('h2.text-3xl.uppercase', { state: 'visible' });

      // Get the second category button (to ensure we're scrolling)
      const categoryButtons = categoryNav.locator('button');
      const buttonCount = await categoryButtons.count();

      if (buttonCount > 1) {
        // Get the text of the second category button
        const secondButton = categoryButtons.nth(1);
        const buttonText = await secondButton.textContent();

        // Get initial scroll position
        const initialScrollY = await page.evaluate(() => window.scrollY);

        // Click the second category button
        await secondButton.click();

        // Wait for scroll animation
        await page.waitForTimeout(1000);

        // Get new scroll position
        const newScrollY = await page.evaluate(() => window.scrollY);

        // Verify we scrolled down
        expect(newScrollY).toBeGreaterThan(initialScrollY);

        // Verify the category heading is now in view
        const categoryHeading = page.locator(`h2:has-text("${buttonText}")`);
        await expect(categoryHeading).toBeInViewport();
      }
    });

    test('should highlight active category as user scrolls', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for navigation to load
      const categoryNav = page.locator('[data-testid="menu-categories-nav"]');
      await expect(categoryNav).toBeVisible();

      // Check initial state - first category should be active
      const firstButton = categoryNav.locator('button').first();
      const initialClasses = await firstButton.getAttribute('class');

      // Active button should have specific styling
      expect(initialClasses).toContain('bg-light-sm');

      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);

      // Check if any button has active state (intersection observer should update)
      const activeButtons = categoryNav.locator('button.bg-light-sm');
      const activeCount = await activeButtons.count();

      // At least one category should be active after scrolling
      expect(activeCount).toBeGreaterThan(0);
    });

    test('should remain sticky when scrolling down the page', async ({ page }) => {
      await page.goto('/es/menu');

      // Wait for navigation to load
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();

      // Get initial position of navigation
      const initialBoundingBox = await nav.boundingBox();
      expect(initialBoundingBox).not.toBeNull();

      // Scroll down significantly
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(300);

      // Navigation should still be visible (sticky)
      await expect(nav).toBeVisible();

      // Check it's near the top of viewport (accounting for main nav height)
      const scrolledBoundingBox = await nav.boundingBox();
      expect(scrolledBoundingBox).not.toBeNull();

      if (scrolledBoundingBox) {
        // Should be positioned near top (around 64px for main nav)
        expect(scrolledBoundingBox.y).toBeLessThan(100);
      }
    });

    test('should work correctly in English locale', async ({ page }) => {
      await page.goto('/en/menu');

      // Wait for navigation to load
      const categoryNav = page.locator('[data-testid="menu-categories-nav"]');
      await expect(categoryNav).toBeVisible();

      // Verify navigation is present
      const categoryButtons = categoryNav.locator('button');
      const buttonCount = await categoryButtons.count();
      expect(buttonCount).toBeGreaterThan(0);

      // Click first category and verify scroll
      if (buttonCount > 0) {
        const firstButton = categoryButtons.first();
        await firstButton.click();
        await page.waitForTimeout(500);

        // Navigation should still be visible
        await expect(firstButton).toBeVisible();
      }
    });
  });
  //end region
});

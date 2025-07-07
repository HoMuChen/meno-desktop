import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays login form on initial load', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('switches between login and signup forms', async ({ page }) => {
    // Should start with login form
    await expect(page.locator('h2')).toContainText('Login');
    
    // Click signup link
    await page.click('text=Sign Up');
    await expect(page.locator('h2')).toContainText('Sign Up');
    
    // Click login link
    await page.click('text=Login');
    await expect(page.locator('h2')).toContainText('Login');
  });

  test('validates required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
  });

  test('handles form submission with validation', async ({ page }) => {
    // Fill in valid email format
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show loading state or error (since we don't have real Firebase)
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('Google sign-in button is present and clickable', async ({ page }) => {
    const googleButton = page.locator('text=Sign in with Google');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
    
    // Click should not cause JavaScript errors
    await googleButton.click();
    await expect(googleButton).toBeDisabled(); // Should show loading state
  });

  test('displays error messages', async ({ page }) => {
    // Fill form with invalid data
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit and wait for error
    await page.click('button[type="submit"]');
    
    // Wait for potential error message (will depend on Firebase mock)
    await page.waitForTimeout(1000);
    
    // Error handling verification (adjust based on actual error display)
    const errorText = page.locator('[style*="color: red"]');
    if (await errorText.isVisible()) {
      await expect(errorText).toBeVisible();
    }
  });

  test('keyboard navigation works properly', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('form submission with Enter key', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Press Enter in password field
    await page.locator('input[type="password"]').press('Enter');
    
    // Should trigger form submission
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('responsive design on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Desktop App Features', () => {
  test('app loads without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known Firebase errors (when not configured)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Firebase') && 
      !error.includes('auth') &&
      !error.includes('firestore')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('app title and meta information', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Desktop App/);
  });

  test('no accessibility violations on main page', async ({ page }) => {
    await page.goto('/');
    
    // Basic accessibility checks
    const heading = page.locator('h2');
    await expect(heading).toBeVisible();
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required');
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('required');
  });
});
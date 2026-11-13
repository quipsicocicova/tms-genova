import { test, expect } from '@playwright/test';

test('desktop: contenuti, immagini, contatti e FAQ', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page).toHaveTitle(/Centro TMS Genova/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('TMS a Genova:');
  await expect(page.locator('.orbit')).toHaveCount(0);
  const photo = await page.locator('.hero-photo').boundingBox();
  expect(Math.abs(photo.width - photo.height)).toBeLessThan(2);
  await expect(page.locator('.hero-subtitle')).toHaveText('un trattamento indolore e senza farmaci per la tua salute mentale');
  await expect(page.locator('.hero-copy p.hero-description')).toContainText('usa impulsi magnetici');
  await expect(page.locator('.visual-label, .image-caption')).toHaveCount(0);
  await expect(page.locator('#domande h2')).toHaveText('Più chiarezza,meno timori');
  for (const heading of await page.locator('h1, h2, h3').all()) {
    expect((await heading.textContent()).trim()).not.toMatch(/\.$/);
  }
  await expect(page.locator('.hero-photo figcaption')).toHaveCount(0);
  await expect(page.locator('footer a[href="tel:+390103753411"]')).toHaveText('010 375 3411');
  await expect(page.locator('footer a[href="mailto:centrotmsgenova@gmail.com"]')).toBeVisible();
  await expect(page.locator('#contatti h3')).toHaveText('Salita Santa Caterina 6/2');
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate(element => element.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator('summary').first().click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await expect(page.locator('details').first().locator('p')).toBeVisible();
  expect(errors).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
});

test('mobile: menu accessibile, navigazione e nessun overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('nav').getByRole('link', { name: 'Il percorso' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#percorso$/);
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  for (const width of [320, 390, 760, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const photo = await page.locator('.hero-photo').boundingBox();
    expect(Math.abs(photo.width - photo.height)).toBeLessThan(2);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
});

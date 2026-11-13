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
  await expect(page.locator('.hero-description')).toHaveText('La stimolazione magnetica transcranica (TMS) usa impulsi magnetici per stimolare in modo mirato alcune aree del cervello. Si svolge in ambulatorio, senza interventi chirurgici.');
  await expect(page.locator('.tag-icon')).toHaveText('*');
  await expect(page.locator('#tms h2')).toHaveText('Una parola nuova, un approccio da capire insieme');
  await expect(page.locator('.large-text')).toContainText('TMS significa Stimolazione Magnetica Transcranica:');
  await expect(page.locator('#percorso h2')).toHaveText('Niente salti nel buio, partiamo dall’ascolto');
  await expect(page.locator('#seduta h2')).toHaveText('Come si svolgeuna seduta TMS');
  await expect(page.locator('#session-title + .session-intro')).toContainText('Dalla preparazione all’avvio del protocollo');
  const sessionTitle = await page.locator('#session-title').boundingBox();
  const sessionIntro = await page.locator('.session-intro').boundingBox();
  expect(sessionIntro.x).toBeCloseTo(sessionTitle.x, 0);
  expect(sessionIntro.y).toBeGreaterThanOrEqual(sessionTitle.y + sessionTitle.height);
  await expect(page.locator('#seduta + #domande')).toHaveCount(1);
  await expect(page.locator('.technology + #seduta')).toHaveCount(1);
  await expect(page.locator('#seduta ol li')).toHaveCount(6);
  await expect(page.locator('#seduta ol h3')).toHaveText([
    'Indossi la cuffietta e la fascia',
    'Ti accomodi sulla poltrona',
    'Rileviamo i punti di riferimento',
    'Posizioniamo il coil',
    'Avviamo il protocollo personalizzato',
    'Concludiamo la seduta',
  ]);
  await expect(page.locator('#seduta img')).toHaveAttribute('src', '/images/WhatsApp%20Image%202026-11-13%20at%2012.56.36.jpeg');
  await expect(page.getByRole('link', { name: 'La seduta, passo dopo passo' })).toHaveAttribute('href', '#seduta');
  await expect(page.locator('.technology h2')).toHaveText('Mirata,non invasiva,personalizzata.');
  await expect(page.locator('.technology h2 br')).toHaveCount(2);
  await expect(page.locator('#contatti h2')).toHaveText('Capiamo se fa per teinsieme, senza fretta');
  await expect(page.locator('#contatti h2 br')).toHaveCount(1);
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
    if (width <= 760) {
      const sessionPhoto = await page.locator('.session-photo').boundingBox();
      const sessionSteps = await page.locator('.session-steps').boundingBox();
      expect(sessionSteps.y).toBeGreaterThanOrEqual(sessionPhoto.y + sessionPhoto.height);
      const questions = await page.locator('.faq-list').boundingBox();
      const contact = await page.locator('.faq-contact').boundingBox();
      expect(contact.y).toBeGreaterThanOrEqual(questions.y + questions.height);
      for (const paragraph of await page.locator('.hero-description, .intro-copy p, .section-top > p, .conditions p, .steps p, .technology p:not(.eyebrow), .faq > div > p:not(.eyebrow), details p, .contact-inner > div > p:not(.eyebrow, .contact-privacy, .contact-status)').all()) {
        expect(await paragraph.evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(14);
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
});

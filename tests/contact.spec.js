import { test, expect } from '@playwright/test';

test('prezzi e protocollo aggiornati', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Quanto costa il trattamento?', { exact: false }).click();
  const answer = page.locator('details').filter({ hasText: 'Quanto costa il trattamento?' });
  await expect(answer.locator('p')).toContainText('150 € a seduta');
  await expect(answer.locator('p')).toContainText('da 10 a 20 sedute');
});

test('modulo senza SMTP: nessuna falsa conferma e nessuna perdita dei dati', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Nome', { exact: true }).fill('Test');
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Come possiamo aiutarti?').fill('Vorrei informazioni sugli appuntamenti.');
  await page.getByRole('button', { name: 'Invia la richiesta' }).click();
  await expect(page.locator('#contact-status')).toContainText('Il modulo non è ancora attivo');
  await expect(page.getByLabel('Nome', { exact: true })).toHaveValue('Test');
  await expect(page.getByRole('button', { name: 'Invia la richiesta' })).toBeEnabled();
});

test('modulo: gestisce una risposta di successo del servizio', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Richiesta inviata.' }) }));
  await page.goto('/');
  await page.getByLabel('Nome', { exact: true }).fill('Test');
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Come possiamo aiutarti?').fill('Vorrei informazioni.');
  await page.getByRole('button', { name: 'Invia la richiesta' }).click();
  await expect(page.locator('#contact-status')).toHaveText('Richiesta inviata.');
  await expect(page.getByLabel('Nome', { exact: true })).toHaveValue('');
});

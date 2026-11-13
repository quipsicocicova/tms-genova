import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:5190', browserName: 'chromium' },
  webServer: { command: 'npm run dev -- --port 5190 --strictPort', url: 'http://127.0.0.1:5190', reuseExistingServer: false },
});

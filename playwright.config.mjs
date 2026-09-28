import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:3000', browserName: 'chromium', channel: 'msedge', headless: true },
  webServer: { command: 'npm.cmd run dev', url: 'http://127.0.0.1:3000', reuseExistingServer: true, timeout: 120000 },
});

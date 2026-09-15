import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:5175', channel: 'msedge', locale: 'zh-CN', viewport: { width: 1600, height: 900 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --port 5175 --strictPort', url: 'http://127.0.0.1:5175', reuseExistingServer: false },
});

import { defineConfig } from '@playwright/test';

// Run npm run build in the repository root before this suite.
export default defineConfig({
  testDir: './tests',
  testMatch: 'archive-polish.spec.ts',
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  webServer: { command: 'npx --yes serve@14 ../../out -l 3100 --no-clipboard', url: 'http://localhost:3100', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:3100', channel: 'msedge', locale: 'zh-CN', viewport: { width: 1600, height: 900 }, screenshot: 'only-on-failure' },
});

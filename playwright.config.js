// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Batasi worker di CI supaya aplikasi di Docker tidak kewalahan
  workers: process.env.CI ? 2 : undefined,
  // open: 'never' supaya terminal tidak "menggantung" menunggu laporan dibuka
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // Test API tidak butuh browser, jadi cukup dijalankan sekali
    {
      name: 'api',
      testMatch: /api\.spec\.js/,
    },

    // Test UI dijalankan di tiga browser
    {
      name: 'chromium',
      testIgnore: /api\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /api\.spec\.js/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /api\.spec\.js/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
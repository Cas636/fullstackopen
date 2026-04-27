import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      port: 5173,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
      cwd: '../bloglist-frontend'
    },
    {
      command: 'npm run dev:test',
      port: 3003,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
      cwd: '../../part4/bloglist'
    },
  ],
})
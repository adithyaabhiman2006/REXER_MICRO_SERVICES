import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3000", reuseExistingServer: true },
  projects: [process.env.CI
    ? { name: "chromium", use: { ...devices["Desktop Chrome"] } }
    : { name: "edge", use: { ...devices["Desktop Edge"], channel: "msedge" } }],
});

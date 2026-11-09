import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { browserName: "chromium", headless: true, trace: "retain-on-failure" },
  projects: [
    { name: "clair", use: { colorScheme: "light" } },
    { name: "sombre", use: { colorScheme: "dark" } },
  ],
  webServer: [
    {
      command: "npm run storybook:serve",
      url: "http://127.0.0.1:6006",
      reuseExistingServer: false,
    },
    {
      command: `npm run preview -- --port 5174 --strictPort --base=${process.env.GALLERY_BASE_PATH ?? "/"}`,
      url: "http://127.0.0.1:5174",
      reuseExistingServer: false,
    },
  ],
});

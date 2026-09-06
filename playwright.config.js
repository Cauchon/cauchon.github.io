const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'line',
  use: {
    baseURL: 'http://127.0.0.1:4000',
    browserName: 'chromium',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'bundle exec jekyll serve --host 127.0.0.1 --port 4000 --no-watch --skip-initial-build',
    url: 'http://127.0.0.1:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});

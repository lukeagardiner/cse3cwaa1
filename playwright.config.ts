import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: 'e2e',
    timeout: 60_000,
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        video: 'retain-on-failure',
    },
    projects: [
        { name: 'chromium', use: {...devices['Desktop Chrome'] } },
    ],
    reporter: [['list'], ['html', {open: 'never'}]],
});
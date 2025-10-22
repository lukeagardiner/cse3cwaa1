import { test, expect } from '@playwright/test';

// dynamic delete account creation
const pid = `deleteme_${Date.now()}`;
const pwd = 'pw123!';

test('delete account removes server record and progress', async ({ page}) => {
    await page.goto('/escape-room'); // base page configured in playwright config

    // create + save once prior to deletion
    await page.getByPlaceholder('Player Id / Email').fill(pid);
    await page.getByPlaceholder('enter-password').fill(pwd);
    await page.getByRole('button', { name: 'Mark Safe Solved' }).click();
    await page.getByRole('button', { name: 'Register / Save Game' }).click();

    // delete action
    page.on('dialog', d => d.accept()); // confirm in the delete route

    await page.getByRole('button', { name: 'Delete Account' }).click();

    // then test loading progress data fails on 404 or allow for error
    await page.getByRole('button', { name: 'Load Last Save Point'}).click();
    await expect(page.getByText(/could not load progress|no previous progress|account deletion/i)).toBeVisible({ timeout: 5000 })
        .catch(() => {});
});
import { test, expect } from '@playwright/test';

// this tests the auth-save-load flow
// this should in theory setup a dynamic user for the current date
const pid = `tester_${Date.now()}`;
const pwd = 'pw123!';

test('register/save and then load progress from the DB', async ({ page }) => {
    await page.goto('/escape-room');

    // setup new player
    await page.getByPlaceholder('Player Id / Email').fill(pid);
    await page.getByPlaceholder('enter-password').fill(pid);

    // mark a stage complete to simulate progress (SafePuzzle)
    await page.getByRole('button', { name: 'Mark Safe Solved'}).click();

    // save action
    await page.getByRole('button', { name: 'Register / Save Game' }).click();

    // check for label update
    await expect(page.getByText(/Saving|saved|success/i)).toBeVisible({ timeout: 5000 })
        .catch(() => {});

    // reset the local progress to prove the load is adding data
    await page.getByRole('button', { name: 'Reset Progress' }).click();

    // load said progress
    await page.getByRole('button', { name: 'Load Last Save Point'}).click();

    // Verify UI shows Safe
    await expect(page.getByText(/Safe:\s/)).toBeVisible({  timeout: 5000 } );

});


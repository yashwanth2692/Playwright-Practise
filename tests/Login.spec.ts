import { test, expect } from 'playwright/test';
import config from '../config/config.json';

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

test.describe('Login suite', () => {

    test('Login with valid credentials', async ({ page }) => {
        await page.goto(config.qaUrl);
        if (!username || !password) {
            throw new Error('USERNAME and PASSWORD environment variables must be set');
        }
        await page.fill('#user-name', username);
        await page.fill('#password', password);
        await page.click('#login-button');
        await expect(page).toHaveURL(/.*inventory.html/);
        await page.close();
    })

    test('Login with invalid credentials', async ({ page }) => {
        await page.goto(config.qaUrl);
        await page.fill('#user-name', 'invalid_user');
        await page.fill('#password', 'invalid_password');
        await page.click('#login-button');
        const errorMessage = await page.locator('.error-message-container').textContent();
        expect(errorMessage).toContain('Username and password do not match any user in this service');
        await page.close();
    })

    test('Login with empty credentials', async ({ page }) => {
        await page.goto(config.qaUrl);
        await page.click('#login-button');
        const errorMessage = await page.locator('.error-message-container').textContent();
        expect(errorMessage).toContain('Username is required');
        await page.close();
    })
})
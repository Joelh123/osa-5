const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Joel',
                username: 'Joel123',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173/')
    })

    test('Login form is shown', async ({ page }) => {
        const header = await page.getByTestId('login-header')
        await expect(header).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByTestId('username').fill('Joel123')
            await page.getByTestId('password').fill('salainen')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Joel logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByTestId('username').fill('Joel123')
            await page.getByTestId('password').fill('wrong')

            await page.getByRole('button', { name: 'login' }).click()

            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('Wrong credentials')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

            await expect(page.getByText('Joel logged in')).not.toBeVisible()
        })
    })
})
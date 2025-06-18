const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const header = await page.getByTestId('login-header')
        await expect(header).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'Joel123', 'salainen')

            await expect(page.getByText('Joel logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'Joel123', 'wrong')

            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('Wrong credentials')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

            await expect(page.getByText('Joel logged in')).not.toBeVisible()
        })
    })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Joel123', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'new blog by playwright', 'greenhorn', 'newbie.com')
            await expect(page.getByText('new blog by playwright')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'new blog by playwright', 'greenhorn', 'newbie.com')
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()

            await expect(page.getByTestId('likes')).toHaveText('1 like')
        })
    })
})
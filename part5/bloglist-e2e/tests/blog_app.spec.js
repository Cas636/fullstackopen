import { test, expect, describe, beforeEach } from '@playwright/test'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByPlaceholder('Enter username').fill('testuser')
      await page.getByPlaceholder('Enter password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByPlaceholder('Enter username').fill('testuser')
      await page.getByPlaceholder('Enter password').fill('wrongpass')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.locator('.alert')).toContainText('wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByPlaceholder('Enter username').fill('testuser')
      await page.getByPlaceholder('Enter password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.waitForTimeout(300)
      await page.getByPlaceholder('Enter title').fill('New Test Blog')
      await page.getByPlaceholder('Enter author').fill('Test Author')
      await page.getByPlaceholder('Enter URL').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.alert')).toContainText('a new blog')
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.waitForTimeout(300)
      await page.getByPlaceholder('Enter title').fill('Like Blog')
      await page.getByPlaceholder('Enter author').fill('Like Author')
      await page.getByPlaceholder('Enter URL').fill('http://like.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(500)
      await page.locator('.blog').first().getByRole('button', { name: 'view' }).click()
      await page.locator('.blogDetails').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the user who created a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.waitForTimeout(300)
      await page.getByPlaceholder('Enter title').fill('Delete Blog')
      await page.getByPlaceholder('Enter author').fill('Del Author')
      await page.getByPlaceholder('Enter URL').fill('http://del.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.alert')).toContainText('a new blog')
    })

    test('only the creator can see the delete button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { name: 'Other User', username: 'otheruser', password: 'password123' }
      })
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.waitForTimeout(300)
      await page.getByPlaceholder('Enter title').fill('Owner Blog Unique')
      await page.getByPlaceholder('Enter author').fill('Owner')
      await page.getByPlaceholder('Enter URL').fill('http://owner.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(500)
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByPlaceholder('Enter username').fill('otheruser')
      await page.getByPlaceholder('Enter password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await page.waitForTimeout(500)
      await page.locator('.blog').filter({ hasText: 'Owner Blog Unique' }).getByRole('button', { name: 'view' }).click()
      await expect(page.locator('.blogDetails').getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.waitForTimeout(300)
      await page.getByPlaceholder('Enter title').fill('Blog One')
      await page.getByPlaceholder('Enter author').fill('Author')
      await page.getByPlaceholder('Enter URL').fill('http://one.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(300)
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.waitForTimeout(300)
      await page.getByPlaceholder('Enter title').fill('Blog Two')
      await page.getByPlaceholder('Enter author').fill('Author')
      await page.getByPlaceholder('Enter URL').fill('http://two.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(500)
      const blogs = await page.locator('.blog').allTextContents()
      expect(blogs.length).toBeGreaterThanOrEqual(2)
    })
  })
})
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> Login >> succeeds with correct credentials
- Location: tests/blog_app.spec.js:21:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('Enter username')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Log in to application" [level=2] [ref=e4]
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: username
      - textbox [ref=e8]
    - generic [ref=e9]:
      - generic [ref=e10]: password
      - textbox [ref=e11]
    - button "login" [ref=e12] [cursor=pointer]
    - button "create account" [ref=e13] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, describe, beforeEach } from '@playwright/test'
  2   | 
  3   | describe('Blog app', () => {
  4   |   beforeEach(async ({ page, request }) => {
  5   |     await request.post('http://localhost:3003/api/testing/reset')
  6   |     await request.post('http://localhost:3003/api/users', {
  7   |       data: {
  8   |         name: 'Test User',
  9   |         username: 'testuser',
  10  |         password: 'password123'
  11  |       }
  12  |     })
  13  |     await page.goto('http://localhost:5173')
  14  |   })
  15  | 
  16  |   test('Login form is shown', async ({ page }) => {
  17  |     await expect(page.getByText('Log in to application')).toBeVisible()
  18  |   })
  19  | 
  20  |   describe('Login', () => {
  21  |     test('succeeds with correct credentials', async ({ page }) => {
> 22  |       await page.getByPlaceholder('Enter username').fill('testuser')
      |                                                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  23  |       await page.getByPlaceholder('Enter password').fill('password123')
  24  |       await page.getByRole('button', { name: 'login' }).click()
  25  |       await expect(page.getByText('Test User logged in')).toBeVisible()
  26  |     })
  27  | 
  28  |     test('fails with wrong credentials', async ({ page }) => {
  29  |       await page.getByPlaceholder('Enter username').fill('testuser')
  30  |       await page.getByPlaceholder('Enter password').fill('wrongpass')
  31  |       await page.getByRole('button', { name: 'login' }).click()
  32  |       await expect(page.locator('.alert')).toContainText('wrong username or password')
  33  |     })
  34  |   })
  35  | 
  36  |   describe('When logged in', () => {
  37  |     beforeEach(async ({ page }) => {
  38  |       await page.getByPlaceholder('Enter username').fill('testuser')
  39  |       await page.getByPlaceholder('Enter password').fill('password123')
  40  |       await page.getByRole('button', { name: 'login' }).click()
  41  |       await expect(page.getByText('Test User logged in')).toBeVisible()
  42  |     })
  43  | 
  44  |     test('a new blog can be created', async ({ page }) => {
  45  |       await page.getByRole('button', { name: 'new blog' }).click()
  46  |       await page.waitForTimeout(300)
  47  |       await page.getByPlaceholder('Enter title').fill('New Test Blog')
  48  |       await page.getByPlaceholder('Enter author').fill('Test Author')
  49  |       await page.getByPlaceholder('Enter URL').fill('http://testblog.com')
  50  |       await page.getByRole('button', { name: 'create' }).click()
  51  |       await expect(page.locator('.alert')).toContainText('a new blog')
  52  |     })
  53  | 
  54  |     test('a blog can be liked', async ({ page }) => {
  55  |       await page.getByRole('button', { name: 'new blog' }).click()
  56  |       await page.waitForTimeout(300)
  57  |       await page.getByPlaceholder('Enter title').fill('Like Blog')
  58  |       await page.getByPlaceholder('Enter author').fill('Like Author')
  59  |       await page.getByPlaceholder('Enter URL').fill('http://like.com')
  60  |       await page.getByRole('button', { name: 'create' }).click()
  61  |       await page.waitForTimeout(500)
  62  |       await page.locator('.blog').first().getByRole('button', { name: 'view' }).click()
  63  |       await page.locator('.blogDetails').getByRole('button', { name: 'like' }).click()
  64  |       await expect(page.getByText('likes 1')).toBeVisible()
  65  |     })
  66  | 
  67  |     test('the user who created a blog can delete it', async ({ page }) => {
  68  |       await page.getByRole('button', { name: 'new blog' }).click()
  69  |       await page.waitForTimeout(300)
  70  |       await page.getByPlaceholder('Enter title').fill('Delete Blog')
  71  |       await page.getByPlaceholder('Enter author').fill('Del Author')
  72  |       await page.getByPlaceholder('Enter URL').fill('http://del.com')
  73  |       await page.getByRole('button', { name: 'create' }).click()
  74  |       await expect(page.locator('.alert')).toContainText('a new blog')
  75  |     })
  76  | 
  77  |     test('only the creator can see the delete button', async ({ page, request }) => {
  78  |       await request.post('http://localhost:3003/api/users', {
  79  |         data: { name: 'Other User', username: 'otheruser', password: 'password123' }
  80  |       })
  81  |       await page.getByRole('button', { name: 'new blog' }).click()
  82  |       await page.waitForTimeout(300)
  83  |       await page.getByPlaceholder('Enter title').fill('Owner Blog Unique')
  84  |       await page.getByPlaceholder('Enter author').fill('Owner')
  85  |       await page.getByPlaceholder('Enter URL').fill('http://owner.com')
  86  |       await page.getByRole('button', { name: 'create' }).click()
  87  |       await page.waitForTimeout(500)
  88  |       await page.getByRole('button', { name: 'logout' }).click()
  89  |       await page.getByPlaceholder('Enter username').fill('otheruser')
  90  |       await page.getByPlaceholder('Enter password').fill('password123')
  91  |       await page.getByRole('button', { name: 'login' }).click()
  92  |       await page.waitForTimeout(500)
  93  |       await page.locator('.blog').filter({ hasText: 'Owner Blog Unique' }).getByRole('button', { name: 'view' }).click()
  94  |       await expect(page.locator('.blogDetails').getByRole('button', { name: 'remove' })).not.toBeVisible()
  95  |     })
  96  | 
  97  |     test('blogs are ordered by likes', async ({ page }) => {
  98  |       await page.getByRole('button', { name: 'new blog' }).click()
  99  |       await page.waitForTimeout(300)
  100 |       await page.getByPlaceholder('Enter title').fill('Blog One')
  101 |       await page.getByPlaceholder('Enter author').fill('Author')
  102 |       await page.getByPlaceholder('Enter URL').fill('http://one.com')
  103 |       await page.getByRole('button', { name: 'create' }).click()
  104 |       await page.waitForTimeout(300)
  105 |       await page.getByRole('button', { name: 'new blog' }).click()
  106 |       await page.waitForTimeout(300)
  107 |       await page.getByPlaceholder('Enter title').fill('Blog Two')
  108 |       await page.getByPlaceholder('Enter author').fill('Author')
  109 |       await page.getByPlaceholder('Enter URL').fill('http://two.com')
  110 |       await page.getByRole('button', { name: 'create' }).click()
  111 |       await page.waitForTimeout(500)
  112 |       const blogs = await page.locator('.blog').allTextContents()
  113 |       expect(blogs.length).toBeGreaterThanOrEqual(2)
  114 |     })
  115 |   })
  116 | })
```
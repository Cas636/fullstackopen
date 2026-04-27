# Part 5: Frontend Bloglist (React + Vite) — Summary

## Overview
Fifth part: builds the complete frontend of the Bloglist application with React, consuming the JWT backend from Part 4. Covers: login/persistence, notifications, componentization, RTL tests, and E2E tests (Playwright/Cypress).

---

## Application 1: Bloglist Frontend

**Objective**: Complete React frontend with authentication, CRUD, notifications.

**Technologies**: React, Vite, Axios, React Testing Library, Playwright/Cypress.

**Requirements**:

### Exercise 5.1 – Basic Login
- Global state: `user` (null or `{ token, username, name }`), `blogs` (array)
- If `user === null` → show only login form (inputs: username, password, button)
- If logged in → show username + list of blogs
- POST `/api/login` → save token to state

### Exercise 5.2 – Persistence + Logout
- Save user to `localStorage` (key: `loggedInUser`)
- On app start: read `localStorage` → reconstruct state `user`
- "Logout" button → clear `localStorage` and `setUser(null)`
- Ensure browser doesn't remember user after logout

### Exercise 5.3 – Create Blog
- Create blog form (only visible if user logged in)
- Fields: `title`, `author`, `url`, `likes` (optional)
- POST `/api/blogs` with header `Authorization: Bearer <token>`
- On create success: reload blog list or add to state

### Exercise 5.4 – Notifications
- `Notification` component (state: `notification` string, `type: 'success'|'error'`)
- Display at top of page
- Auto-disappear after 5 seconds (setTimeout)
- Styles: green for success, red for error

### Exercise 5.5 – Toggle Form
- "Create new blog" button that shows/hides form
- Hidden by default

### Exercise 5.6 – `CreateBlogForm` Separate Component
- Extract form to `CreateBlogForm.jsx`
- Move local state (`title`, `author`, `url`, `likes`) to this component
- Prop `onBlogCreated` callback (receives created blog)

### Exercise 5.7 – Details Toggle per Blog
- Each blog has local state `showDetails` (boolean)
- "Show" / "Hide" button toggles visibility of details (url, likes, like/delete buttons)
- Details hidden by default

### Exercise 5.8 – Like Button
- PUT `/api/blogs/:id` with ALL blog fields (backend replaces resource)
- Send: `{ title, author, url, likes, user }`
- Update `likes` locally after successful PUT

### Exercise 5.9 – Fix User Not Appearing
- Problem: after like, blog creator's name doesn't appear until reload
- Solution: ensure `blog.user` (ObjectId) is compared as string: `blog.user.toString() === user.id.toString()`
- Or: refetch blogs after like to update complete data

### Exercise 5.10 – Sort by Likes
- Sort `blogs` array by `likes` descending: `.sort((a,b) => b.likes - a.likes)`
- Before rendering list

### Exercise 5.11 – Delete Button
- DELETE `/api/blogs/:id`
- Confirm with `window.confirm` before deleting
- Show delete button ONLY if blog was created by current user (`blog.user === user.id`)

### Exercise 5.12 – ESLint
- Configure `eslint.config.js` (Vite already includes ESLint)
- Fix all errors/warnings

### Exercise 5.13–5.16 – React Testing Library (RTL) Tests
Setup `@testing-library/react`, `@testing-library/jest-dom`, `vitest` (or Jest).

- **Test 1**: `Blog` component shows title and author, does NOT show url or likes by default
- **Test 2**: Clicking "Show" button → url and likes appear
- **Test 3**: Double click on like button → handler called 2 times (`jest.fn()`)
- **Test 4**: `CreateBlogForm` calls `onCreate` with correct data on submit

### Exercise 5.17–5.23 – E2E Tests (Playwright or Cypress)
Separate project `bloglist-e2e/`.

**Common Setup**:
- `beforeEach`: clean DB (POST to testing endpoint), create test user
- Base URL: frontend at `http://localhost:5173`

**Playwright Tests**:
1. Login form shown by default
2. Login succeeds with correct credentials
3. Login fails with wrong credentials
4. Logged-in user can create blog
5. User can like blog
6. User can delete blog (handle `window.confirm` with `page.on('dialog')`)
7. Only creator sees delete button
8. Blogs sorted by likes (most liked first → `cy.get('.blog').eq(0)`)

**Cypress Tests** (alternative):
- Similar structure with `cy.visit()`, `cy.get()`, `cy.click()`
- Handle dialogs with `cy.on('window:confirm')`

---

## Frontend Final Structure
```
src/
├── App.jsx                  # State: user (null or object), blogs (array)
├── main.jsx                 # ReactDOM + QueryClientProvider if React Query
├── services/
│   └── blogService.js       # axios: getBlogs, createBlog, updateBlog, deleteBlog, login
├── components/
│   ├── Blog.jsx             # Local state: showDetails
│   ├── BlogList.jsx
│   ├── CreateBlogForm.jsx
│   ├── Notification.jsx
│   ├── LoginForm.jsx
│   └── User.jsx             # (for Part 7)
├── hooks/                   # (optional custom hooks)
└── index.css                # global styles
```

**Commands**:
```bash
npm install                 # dependencies
npm run dev                 # development (Vite)
npm run build               # production
npm test                    # RTL tests
npx playwright test         # E2E tests (Playwright)
```

---

## Consumed Backend
API from **Part 4** backend running on `http://localhost:3001/api`:
- `GET /api/blogs`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `POST /api/login`
- `GET /api/users`
- `GET /api/users/:id`

---

## Execution Guide:

### Prerequisites
- Node.js installed
- MongoDB Atlas configured (`.env` file with MONGODB_URI)

### Project Execution

#### 1. Backend (Part 4)
```bash
cd part4/bloglist
npm install
npm run dev
```
Backend will start at `http://localhost:3003`

#### 2. Frontend (Part 5)
```bash
cd part5/bloglist-frontend
npm install
npm run dev
```
Frontend will start at `http://localhost:5173`

#### 3. E2E Tests (Playwright)
```bash
cd part5/bloglist-e2e
npm install
npx playwright test
```

### Environment Variables (.env)
Create file `part4/bloglist/.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bloglistApp
PORT=3003
TEST_MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/testBloglistApp
SECRET=your_secret_key
```

### Ports Used
- Frontend: 5173
- Backend: 3003
- MongoDB: 27017 (Atlas)

---

## Bloglist Frontend

![Bloglist App](../Imagenes/Blog%20app.png)

![Bloglist App](../Imagenes/the%20story%20of%20a%20life.png)

*Example of functionality showing complete blog list with expanded details: "hide" buttons to collapse details, URLs, likes counter with functional "like" button, author information, and "remove" buttons to delete blogs created by the user.*

---
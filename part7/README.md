# Part 7: React Router, Custom Hooks and Complete Bloglist — Summary

## Overview
Seventh and final part: adds routing (React Router v6) to the anecdotes app, creates advanced custom hooks, and completes the Bloglist app with additional views, comments, and styling.

---

## Application 1: Routed Anecdotes

**Objective**: Introduce React Router for multi-view SPA.

**Technologies**: react-router-dom v6, useParams, useNavigate.

**Requirements**:

### Exercise 7.1 – Basic Routing
- Install `react-router-dom`
- `BrowserRouter` at root (`main.jsx`)
- `Routes` and `Route` in `App.jsx`:
  - `/` → `AnecdoteList` component (list of anecdotes)
  - `/create` → `CreateAnecdote` component (form)
- `Menu` component with `<Link to="/">Home</Link>`, `<Link to="/create">Create</Link>`
- `Footer` always visible (outside `<Routes>`)

### Exercise 7.2 – Individual View
- Route `/:id` (e.g., `/anecdotes/3`)
- `useParams()` to extract `id` from URL
- Search anecdote by `id` in array
- Display individual anecdote on its own page
- In list: each anecdote is a `<Link to={`/anecdotes/${id}`}>` with name clickable

### Exercise 7.3 – Redirect + Notification
- After successful anecdote creation: `useNavigate()` → `navigate('/')`
- Show "Anecdote created" notification for 5 seconds on home page

**Status**: COMPLETED

**Structure**:
```
src/
├── main.jsx             # <BrowserRouter>
├── App.jsx              # <Routes> + <Outlet />
├── components/
│   ├── Menu.jsx
│   ├── Footer.jsx
│   ├── AnecdoteList.jsx
│   ├── CreateAnecdote.jsx
│   └── Anecdote.jsx     # individual view
└── hooks/
```

---

## Application 2: Custom Hooks (Ex. 7.4–7.8)

**Objective**: Create reusable hooks for forms and data fetching.

### Exercise 7.4 – `useField` Hook

**Objective**: Simplify controlled forms.

- Create `src/hooks/index.js`
- `useField(type)`:
  ```js
  const [value, setValue] = useState('')
  const onChange = e => setValue(e.target.value)
  return { type, value, onChange }
  ```
- Usage: `const title = useField('text')`
- Render: `<input {...title} />`

**Status**: COMPLETED

### Exercise 7.5 – Reset in Hook

**Objective**: Add button to clear form.

- Extend `useField` to return `reset`: `() => setValue('')`
- "Clear" button in form that calls `reset()` on each field
- Possible warning: "Invalid value for prop `reset` on `<input>` tag"

**Status**: COMPLETED

### Exercise 7.6 – Remove Warning

**Objective**: Avoid passing `reset` to `<input>` element.

- Solution: in component, destructure and omit `reset`:
  ```js
  const { reset, type, value, onChange } = content
  return <input type={type} value={value} onChange={onChange} />
  ```
- Or alternatively: hook returns separate properties, not used spread on input

**Status**: COMPLETED

### Exercise 7.7 – `useCountry`

**Objective**: Hook for searching countries.

- Clone `country-hook`
- Implement `useCountry(name)`:
  ```js
  const [country, setCountry] = useState(null)
  useEffect(() => {
    if (!name) return
    fetch(`https://studies.cs.helsinki.fi/restcountries/name/${name}`)
      .then(r => r.json())
      .then(setCountry)
      .catch(() => setCountry(null))
  }, [name])
  return country
  ```
- Use `useEffect` with `name` as dependency to refetch
- Handle "country not found" by returning `null`

**Status**: COMPLETED

### Exercise 7.8 – `useResource` (Ultimate Hooks)

**Objective**: Generic hook for REST resource CRUD.

- Clone `ultimate-hooks`
- Hook `useResource(baseUrl)`:
  ```js
  const [resources, setResources] = useState([])
  const service = {
    getAll: async () => {
      const res = await fetch(baseUrl)
      const data = await res.json()
      setResources(data)
      return data
    },
    create: async (obj) => {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      })
      const created = await res.json()
      setResources([...resources, created])
      return created
    }
  }
  return [resources, service]
  ```
- Use for multiple entities:
  - `const [notes, noteService] = useResource('/api/notes')`
  - `const [persons, personService] = useResource('/api/persons')`

**Status**: COMPLETED

---

## Application 3: Complete Bloglist (Part 7)

**Objective**: Major expansion of Bloglist with React Router, global state, views, comments, and styling.

**Technologies**: React Router v6, Redux or React Query/Context, Material UI/Bootstrap.

### Prerequisites
- **Part 4** backend running at `http://localhost:3001`
- **Part 5** frontend base (with login, blog CRUD, notifications)

### Exercise 7.9 – Prettier

**Objective**: Automatic code formatting.

- Install Prettier: `npm i -D prettier`
- Create `.prettierrc` or `prettier.config.js`
- Configure editor for "format on save"
- Integrate with ESLint (`eslint-plugin-prettier`)

**Status**: COMPLETED

### Exercise 7.10–7.13 – Global State (two options)

#### Option A: Redux
**7.10** – Notifications store:
- `notificationSlice` (RTK) → `{ notification: '' }`
- Actions: `setNotification`, `clearNotification`

**7.11** – Blogs in Redux:
- `blogsSlice`: state `{ items: [] }`
- Thunk `loadBlogs` → fetch GET `/api/blogs`
- Thunk `addBlog` → POST + dispatch on success
- View: `useSelector` → `blogs.items`

**7.12** – Like and Delete in Redux:
- `likeBlog(id)` → PUT request, update state
- `deleteBlog(id)` → DELETE, remove from state

**7.13** – User store:
- `userReducer`: `{ user: null }`
- `login(credentials)` thunk → POST `/api/login` → save token in localStorage + state
- `logout` → clean up

#### Option B: React Query + Context
**7.10** – Notification Context (useReducer):
- `NotificationContext` with `SET`/`CLEAR` reducer
- Provider in `App`

**7.11** – React Query for blogs:
```js
const { data: blogs } = useQuery({
  queryKey: ['blogs'],
  queryFn: fetchBlogs
})
const createMutation = useMutation({
  mutationFn: postBlog,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
})
```

**7.12** – Like and Delete with `useMutation`

**7.13** – User Context (useReducer):
- `userReducer` handles `LOGIN`, `LOGOUT`
- Login success: dispatch `LOGIN(user)`, persist token in localStorage

**Status**: COMPLETED (at least one option implemented)

### Exercise 7.14 – Users View

**Objective**: Display users table with blog count.

- Route `/users` → `UserList` component
- GET `/api/users` (with blogs populate)
- Render table: `name` (username) | `blogs count`
- Each name is a link to `/users/:id`

**Status**: COMPLETED

### Exercise 7.15 – Individual User View

**Objective**: Show all blogs of a user.

- Route `/users/:id` → `User` component
- `useParams()` to get `id`
- GET `/api/users/:id` (with blogs populate)
- Render list of blogs for that user
- IMPORTANT: conditional rendering if `user` is null (avoids "cannot read property name of undefined" error on direct page reload)

**Status**: COMPLETED

### Exercise 7.16 – Individual Blog View

**Objective**: Dedicated page for each blog.

- Route `/blogs/:id` → `Blog` component
- GET `/api/blogs/:id` (with user + comments populate)
- Display: title, author, URL (external link), likes, comments
- In blog list: title is link to this view
- From this point on, "toggle details" functionality (Ex. 5.7) is NO LONGER NEEDED

**Status**: COMPLETED

### Exercise 7.17 – Navigation

**Objective**: Global navigation menu.

- `Menu`/`Navbar` component with links using `<Link>` or `<NavLink>`
- Routes: Home (blog list), Users, Create blog (if logged in), Login/Logout
- Active styles with `NavLink` (`className = ({ isActive }) => isActive ? 'active' : ''`)

**Status**: COMPLETED

### Exercise 7.18 – Comments (Backend)

**Objective**: Extend backend to support comments.

- `Comment` model: `{ content: String, blog: { type: ObjectId, ref: 'Blog' }, createdAt: Date }`
- POST `/api/blogs/:id/comments` → add comment to blog
- GET blog → `populate('comments')` includes comments sorted by date

**Status**: COMPLETED

### Exercise 7.19 – Comments (Frontend)

**Objective**: UI for comments in blog view.

- In `Blog` component (individual view): `CommentForm` form
- `content` input + "Add comment" button
- POST to `/api/blogs/:id/comments` with Authorization if desired (but anonymous comments allowed)
- After success: refetch blog or invalidate React Query cache
- Display comments list below likes

**Status**: COMPLETED

### Exercise 7.20–7.21 – Styling

**Objective**: Improve UI with styling framework.

- Options: Material UI (MUI) or Bootstrap
- Apply styles to:
  - Users table
  - Buttons (primary, secondary, danger)
  - Forms (inputs, labels)
  - Blog cards / list items
  - Notification alerts
- Invest at least 1 hour in styling

**Status**: COMPLETED

---

## Final Bloglist Structure (React Router + React Query example)

```
src/
├── main.jsx                  # <QueryClientProvider> + <BrowserRouter>
├── App.jsx                   # <Routes> defined
├── services/
│   ├── blogService.js
│   └── authService.js
├── contexts/
│   ├── NotificationContext.jsx
│   └── UserContext.jsx
├── components/
│   ├── Menu.jsx
│   ├── BlogList.jsx
│   ├── Blog.jsx
│   ├── CreateBlogForm.jsx
│   ├── UserList.jsx
│   ├── User.jsx
│   ├── Notification.jsx
│   └── CommentForm.jsx
├── hooks/
│   └── useBlogs.js           # encapsulates useQuery/useMutation
└── pages/                    # optional: separate full pages
```

### Final Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `BlogList` | List all blogs (sorted by likes) |
| `/blogs/:id` | `Blog` | Blog detail + comments |
| `/users` | `UserList` | Users table + blog count |
| `/users/:id` | `User` | Blogs by specific user |
| `/create` | `CreateBlogForm` | Create blog form (protected) |
| `/login` | `LoginForm` | Login |
| `/logout` | Handler | Logout (clears state + localStorage) |

---

## Transversal Themes Part 7
- **React Router v6**:
  - `<Routes>` + `<Route path element={Component} />`
  - `<Link>` for navigation without reload
  - `useParams()` for dynamic segments
  - `useNavigate()` for programmatic navigation
  - `<Outlet />` for nested routes
- **Custom Hooks**:
  - `useField` → abstracts useState from inputs
  - `useCountry` → data fetching with useEffect
  - `useResource` → generic CRUD
- **Context API**: Global UI state (notifications, user)
- **React Query**: Declarative data fetching, caching, invalidations
- **MUI/Bootstrap**: Styled components, theming

---

## Summary of Part 7 Applications

| # | Application | Status |
|---|-----------|--------|
| 1 | Routed Anecdotes | COMPLETED |
| 2 | Custom Hooks (useField, useCountry, useResource) | COMPLETED |
| 3 | Complete Bloglist (Router + Global State + Views + Comments + Styling) | COMPLETED |
| 4 | Bloglist E2E Tests (Playwright/Cypress) | COMPLETED |

---

Test credentials: username: `testuser`, password: `password123`

## Execution Guide:

### Prerequisites
- Node.js installed
- MongoDB Atlas configured (`.env` file with MONGODB_URI)

### Project Execution

#### 1. Backend
```bash
cd part7/bloglist/bloglist-backend
npm install
npm run dev
```
Backend will start at `http://localhost:3003`

#### 2. Frontend
```bash
cd part7/bloglist/bloglist-frontend
npm install
npm run dev
```
Frontend will start at `http://localhost:5173`

#### 3. Tests (Backend)
```bash
cd part7/bloglist/bloglist-backend
npm test
```

### Environment Variables (.env)
Create file `part7/bloglist/bloglist-backend/.env`:
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

### Implemented Features
- React Router for navigation
- React Query for state management
- Context API for notifications and user
- Bootstrap for styling
- Blog, user, and detail views
- Comments on blogs
- Delete button (only visible to creator)
- No auto-login (requires manual login)

---

## Applications in Action

## Anecdotes

### Display
![Anecdutes App](../Imagenes/Anecdote%20app%20tolkien.png)

*Application layout*

### Create
![Anecdutes App Display](../Imagenes/create%20new%20anecdote.png)

*Create new anecdotes and view them in the application.*

---

## Ultimate Hooks

![Ultimate Hooks](../Imagenes/ultimate%20hooks.png)

*Collection of advanced custom hooks for state management and side effects.*

## Country Hook
![Country Hook](../Imagenes/country-hook.png)

*Custom hook for country search with caching and error handling.*

---

## Complete Bloglist

### Login
![Bloglist Login](../Imagenes/Login%20Bloglist.jpeg)

*Authentication screen with secure credential validation.*

### Blog View
![Bloglist Blog View](../Imagenes/blog%20like.png)

*Detailed blog view with likes system and interaction buttons.*

### Create Blog
![Bloglist Create](../Imagenes/blog%20app%20create%20new.png)

*Form to create new posts with title, author, and URL fields.*

## Success Notification
![Bloglist Success](../Imagenes/a%20day%20in%20a%20life%20of%20a%20turtle.png)

*Visual feedback confirming successful blog creation.*

---

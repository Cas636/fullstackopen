# Full Stack Open — Helsinki Exercises

Complete exercises repository for the Full Stack Open course from the University of Helsinki.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Exercise List](#exercise-list)
- [Repository Structure](#repository-structure)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Useful Commands](#useful-commands)
- [Notes](#notes)

---

## Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**
- **MongoDB Atlas** (free account for parts 3-7)

---

## Exercise List

| Part | Topics | Exercises |
|------|--------|----------|
| **0** | Web fundamentals | Sequence diagrams (0.1-0.6) |
| **1** | React basics | Components, props, state (1.1-1.14) |
| **2** | Forms & APIs | CRUD, JSON Server, REST (2.1-2.20) |
| **3** | Node.js & MongoDB | Express, Mongoose, backend (3.1-3.22) |
| **4** | Testing & JWT | Unit tests, integration tests, authentication (4.1-4.23) |
| **5** | React frontend | Login, notifications, E2E tests (5.1-5.31) |
| **6** | Redux & state | Redux, RTK, async thunks (6.1-6.19) |
| **7** | Router & advanced | React Router, custom hooks, complete bloglist (7.1-7.21) |

---

## Repository Structure

```
helsinki-fullstack/
├── part0/    # Web fundamentals (diagrams)
├── part1/    # React basics
├── part2/    # Forms, APIs, JSON Server
├── part3/    # Node.js, Express, MongoDB
├── part4/    # Backend with testing & JWT
├── part5/    # React frontend
├── part6/    # Redux & global state
├── part7/    # Router, hooks, complete bloglist
└── README.md
```

---

## Environment Variables

**Required for**:
- **Part 2** (countries): OpenWeatherMap API key
- **Part 3**: MongoDB URI
- **Part 4**: MongoDB URI + JWT secret
- **Part 7**: MongoDB URI + JWT secret

**Example .env files**:

```env
# Part 3/4/7 Backend
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
TEST_MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/testdbname
PORT=3001
SECRET=your_jwt_secret_key

# Part 2 (countries)
VITE_WEATHER_API_KEY=your_openweathermap_key
```

---

## Quick Start

Each part has its own folder. See each `README.md` for detailed setup instructions.

**General workflow**:
```bash
cd part[N]/[project]
npm install
npm run dev      # or npm start / npm run server for backends
```

**With MongoDB**: Create `.env` from `.env.example` and add your credentials:
```bash
cp .env.example .env
# Edit MONGODB_URI and other variables
npm run dev
```

---

## Running Tests

```bash
# Backend (Node.js unit & integration)
cd part4/bloglist && npm test

# Frontend (Vitest)
cd part5/bloglist-frontend && npm test

# E2E (Playwright)
cd part5/bloglist-e2e && npx playwright test
```

---

## Ports

| Service | Port |
|---------|------|
| Frontend (Vite) | 5173 |
| Backend (Parts 3, 4, 7) | 3001 or 3003 |
| JSON Server | 3001 |

---

## Useful Commands

```bash
npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run tests
npx playwright test      # Run E2E tests
```

---

## Notes

- **MongoDB Atlas**: Free account at https://www.mongodb.com/cloud/atlas
- **OpenWeatherMap API**: Free key at https://openweathermap.org/api
- Each part folder contains its own `README.md` with detailed instructions


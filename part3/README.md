# Part 3: Node.js, Express and MongoDB — Summary

## Overview
Third part: temporarily abandons the frontend to build the backend with Node.js + Express, introduces MongoDB with Mongoose, cloud deployment (Fly.io/Render), and validations.

---

## Application 1: Phonebook Backend (Node + Express)

**Objective**: Build REST API for phonebook.

**Technologies**: Node.js, Express, Morgan, JSON Server (optional), deployment on Fly.io/Render.

**Requirements**:

### Exercise 3.1 – GET list
- GET `/api/persons` → returns JSON array of persons
- GET `/info` → plain text with timestamp and number of entries

### Exercise 3.2 – Info page
- Format with simple HTML (`<br/>` or `<p>`)

### Exercise 3.3 – GET one
- GET `/api/persons/:id` → 404 if not found

### Exercise 3.4 – DELETE
- DELETE `/api/persons/:id` → delete resource

### Exercise 3.5 – POST create
- POST `/api/persons` → create person with `id = Math.random()`
- Generate ID with wide range to avoid collisions

### Exercise 3.6 – POST validations
- If name or number missing → 400 Bad Request
- If name already exists → 400 + `{ error: 'name must be unique' }`

### Exercise 3.7 – Morgan
- `morgan('tiny')` middleware for console logs

### Exercise 3.8 – Morgan with POST data
- Configure Morgan to show body of POST requests

**Commands**:
```bash
npm start      # production
npm run dev    # development with nodemon
```

**Status**: COMPLETED

---

## Application 2: Backend + Static Frontend Deployment

**Objective**: Deploy backend to the cloud and serve frontend from Express.

**Technologies**: Fly.io, Render, Express static middleware.

**Requirements**:

### Exercise 3.9 – Connect frontend
- Phonebook frontend (Part 2) consumes local backend
- Configure proxy in Vite (`vite.config.js`) to avoid CORS
- Adjust axios URLs to backend

### Exercise 3.10 – Deploy backend
- Deploy backend to Fly.io or Render
- Fly.io commands: `fly launch`, `fly deploy` (from backend root directory)
- Verify `/api/persons` endpoint works in production

### Exercise 3.11 – Build frontend
- `npm run build` in frontend → generates `dist/`
- Copy `dist/` folder into the backend
- Express: `app.use(express.static('dist'))` to serve static files
- Test locally: `http://localhost:3001/` should load complete app

**Note**: Only backend is deployed (not frontend separately). Frontend static build lives within the backend repository.

**Status**: COMPLETED

---

## Application 3: Phonebook + MongoDB (Atlas)

**Objective**: Migrate from JSON to NoSQL database with Mongoose.

**Technologies**: MongoDB Atlas, Mongoose, Node CLI, validations.

**Requirements**:

### Exercise 3.12 – CLI mongo.js
- File `mongo.js` in backend project root
- Arguments: `node mongo.js <password> [name] [number]`
- If only password → list all persons (`Person.find({})`)
- If name and number → add new person
- Use Mongoose + connection to Atlas (URI with password)
- DO NOT include password in git

### Exercise 3.13–3.14 – Migrate GET and POST to DB
- Model `Person` in `models/person.js` (Mongoose schema: `name`, `number`)
- Move all Mongoose logic to separate module
- GET `/api/persons` → `Person.find({})`
- POST → `new Person(req.body).save()`
- Validate unique name in controller (before save)

### Exercise 3.15–3.16 – DELETE + Error middleware
- DELETE `/api/persons/:id` → `Person.findByIdAndDelete(id)`
- Create separate error middleware (`errorhandler.js`)
- Pass errors with `next(error)`

### Exercise 3.17* – PUT update
- PUT `/api/persons/:id` → update number if name already exists
- Frontend: if POST fails due to duplicate name, do PUT instead
- Compare IDs correctly (convert to string if ObjectId)

### Exercise 3.18* – Routes to DB
- GET `/api/persons/:id` → from DB (404 if not found)
- GET `/info` → `Person.countDocuments()` for count

### Exercise 3.19* – Name validation
- Validation in controller: `name.length >= 3`
- Send 400 + message if fails
- Frontend: show error from `error.response.data.error`

### Exercise 3.20* – Phone validation
- Custom validation in Mongoose schema:
  - Minimum 8 characters
  - Format: `XX-XXXXXXXX` or `XXX-XXXXXXXX` (2-3 digits, dash, 7-8 digits)
  - Use `match` with regex: `/^\d{2,3}-\d{7,8}$/`
- 400 + message if not compliant

### Exercise 3.21 – Full-stack deployment with DB
- Build new frontend, copy `dist/` to backend
- Test locally `http://localhost:3001/`
- Deploy backend (with DB Atlas) to Fly.io/Render

### Exercise 3.22 – ESLint
- Add ESLint to backend
- Fix all warnings

**Environment Variables**:
```
MONGODB_URI=mongodb+srv://...
SECRET=secret_jwt_for_tokens (if JWT is used later)
```

**Status**: COMPLETED

---

## Transversal Themes Part 3
- **Express**: middlewares (cors, json, morgan), routes, `res.status().json()`
- **Mongoose**: schemas, models, methods (find, findById, save, findByIdAndDelete), `toJSON` transform
- **Async/await**: do not mix with `.then()` (one or the other)
- **Deployment**: Fly.io (`fly.toml`), Render (config in web UI)
- **Static files**: `express.static('dist')` to serve React build

---

## Environment Variable

MONGODB_URI=mongodb+srv://prueba_db_user:TCXCIDzirWDgcGxq@cluster0.4ggyipq.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001

---

## Applications in Action

### Phonebook Backend
![Phonebook Backend](../Imagenes/phonebook%20backend.png)

*Phonebook REST API with validations, MongoDB, and complete backend logic.*

---

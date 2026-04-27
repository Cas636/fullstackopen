const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

let token

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const userForToken = { username: user.username, id: user.id }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user.id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const body = response.body
  body.forEach(blog => {
    assert(Object.keys(blog).includes('id'))
    assert(!Object.keys(blog).includes('_id'))
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('Canonical string reduction'))
})

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('if title or url properties are missing, it will return 400 Bad Request', async () => {
  const newBlogMissingTitle = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogMissingTitle)
    .expect(400)

  const newBlogMissingUrl = {
    title: 'First class tests',
    author: 'Robert C. Martin'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogMissingUrl)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await api.get('/api/blogs')
  const modifiedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
  
  assert.strictEqual(modifiedBlog.likes, 100)
})

test('adding a blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'A blog without token',
    author: 'Hacker',
    url: 'http://hacker.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})

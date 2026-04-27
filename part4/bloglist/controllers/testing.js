const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Crear usuario de prueba por defecto
  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash,
  })
  await user.save()

  response.status(204).end()
})

module.exports = router
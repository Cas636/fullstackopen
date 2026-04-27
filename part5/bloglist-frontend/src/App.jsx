import { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Table, Card, Navbar, Nav } from 'react-bootstrap'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Logged user from localStorage:', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch {
      notify('error adding blog', 'error')
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)))
    } catch {
      notify('error updating blog', 'error')
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    if (
      window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)
    ) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((b) => b.id !== id))
        notify(`blog ${blogToDelete.title} removed`)
      } catch {
        notify('error deleting blog', 'error')
      }
    }
  }

  if (user === null) {
    return (
      <Container className="mt-5">
        <Card>
          <Card.Body>
            <Card.Title className="mb-4">Log in to application</Card.Title>
            <Notification message={message} type={messageType} />
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                  placeholder="Enter password"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Blog App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">Home</Nav.Link>
            </Nav>
            <Navbar.Text className="me-3">
              {user.name} logged in
            </Navbar.Text>
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
              logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Notification message={message} type={messageType} />

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <Table striped bordered hover className="mt-3">
        <tbody>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                currentUser={user}
              />
            ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default App
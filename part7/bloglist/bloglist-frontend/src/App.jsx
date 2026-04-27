import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import {
  Container,
  Table,
  Form,
  Button,
  Navbar,
  Nav,
  Card
} from 'react-bootstrap'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useUserValue, useUserDispatch } from './contexts/UserContext'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import RegisterForm from './components/RegisterForm'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const blogFormRef = useRef()

  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()
  const user = useUserValue()
  const dispatchUser = useUserDispatch()

  const notify = (message, type = 'success') => {
    dispatchNotification({ type: 'SET', payload: { message, type } })
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR' })
    }, 5000)
  }

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      blogFormRef.current?.toggleVisibility()
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    },
    onError: () => {
      notify('error adding blog', 'error')
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      notify('error updating blog', 'error')
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      notify('error deleting blog', 'error')
    }
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatchUser({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
      setIsRegistering(false)
    } catch (_e) {
      notify('wrong username or password', 'error')
    }
  }

  const handleRegister = async (userData) => {
    const newUser = await userService.create(userData)
    notify(`user ${newUser.username} created successfully`, 'success')
    setIsRegistering(false)
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatchUser({ type: 'CLEAR' })
    blogService.setToken(null)
  }

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const updateBlog = (id, blogObject) => {
    updateBlogMutation.mutate({ id, blog: blogObject })
  }

  const _deleteBlog = (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
    ) {
      deleteBlogMutation.mutate(id)
      notify(`blog ${blogToDelete.title} removed`)
    }
  }

  const matchUser = useMatch('/users/:id')
  const userProfile = matchUser
    ? users.find((u) => u.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const blogDetails = matchBlog
    ? blogs.find((b) => b.id === matchBlog.params.id)
    : null

  if (user === null) {
    return (
      <Container>
        <h2>{isRegistering ? 'Register' : 'Log in to application'}</h2>
        <Notification />
        {isRegistering ? (
          <RegisterForm registerUser={handleRegister} />
        ) : (
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              login
            </Button>
            <Button
              variant="link"
              className="ms-2"
              onClick={() => setIsRegistering(true)}
            >
              create account
            </Button>
          </Form>
        )}
        {isRegistering && (
          <Button
            variant="link"
            className="mt-2"
            onClick={() => setIsRegistering(false)}
          >
            back to login
          </Button>
        )}
      </Container>
    )
  }

  const Menu = () => (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className="mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blog App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              users
            </Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text className="me-3">{user.name} logged in</Navbar.Text>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleLogout}
            >
              logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )

  const Home = () => (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <Table striped>
        <tbody>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )

  const UsersView = () => (
    <div>
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs ? u.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )

  const UserProfile = ({ userProfile }) => {
    if (!userProfile) return null

    return (
      <div>
        <h2>{userProfile.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {userProfile.blogs.map((b) => (
            <li key={b.id}>{b.title}</li>
          ))}
        </ul>
      </div>
    )
  }

  const BlogDetails = ({ blogDetails }) => {
    if (!blogDetails) return null

    const canDelete =
      user && blogDetails.user && user.username === blogDetails.user.username

    const handleDelete = () => {
      if (
        window.confirm(
          `Remove blog ${blogDetails.title} by ${blogDetails.author}`
        )
      ) {
        deleteBlogMutation.mutate(blogDetails.id)
        notify(`blog ${blogDetails.title} removed`)
      }
    }

    return (
      <div>
        <h2>
          {blogDetails.title} {blogDetails.author}
        </h2>
        <div>
          <a href={blogDetails.url}>{blogDetails.url}</a>
        </div>
        <div>
          {blogDetails.likes} likes
          <button
            onClick={() =>
              updateBlog(blogDetails.id, {
                ...blogDetails,
                likes: blogDetails.likes + 1,
                user: blogDetails.user.id
              })
            }
          >
            like
          </button>
        </div>
        <div>added by {blogDetails.user.name}</div>
        {canDelete && (
          <button
            style={{ backgroundColor: 'lightblue', marginTop: '10px' }}
            onClick={handleDelete}
          >
            remove
          </button>
        )}
      </div>
    )
  }

  return (
    <Container>
      <Menu />
      <Notification />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersView />} />
        <Route
          path="/users/:id"
          element={<UserProfile userProfile={userProfile} />}
        />
        <Route
          path="/blogs/:id"
          element={<BlogDetails blogDetails={blogDetails} />}
        />
      </Routes>
    </Container>
  )
}

export default App

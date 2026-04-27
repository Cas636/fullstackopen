import fs from 'fs'

const code = `import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useUserValue, useUserDispatch } from './contexts/UserContext'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()
  const user = useUserValue()
  const dispatchUser = useUserDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [dispatchUser])

  const notify = (message, type = 'success') => {
    dispatchNotification({ type: 'SET', payload: { message, type } })
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR' })
    }, 5000)
  }

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      blogFormRef.current?.toggleVisibility()
      notify(\`a new blog \${newBlog.title} by \${newBlog.author} added\`)
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
    } catch (e) {
      notify('wrong username or password', 'error')
    }
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

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    if (window.confirm(\`Remove blog \${blogToDelete.title} by \${blogToDelete.author}\`)) {
      deleteBlogMutation.mutate(id)
      notify(\`blog \${blogToDelete.title} removed\`)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {isLoading ? (
        <div>loading blogs...</div>
      ) : (
        [...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              currentUser={user}
            />
          ))
      )}
    </div>
  )
}

export default App
`
fs.writeFileSync('src/App.jsx', code)
console.log('App.jsx refactored to React Query and Context API!')

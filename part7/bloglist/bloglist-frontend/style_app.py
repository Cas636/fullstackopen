import sys
import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Add imports for react-bootstrap
imports_to_add = "import { Container, Table, Form, Button, Navbar, Nav, Card } from 'react-bootstrap'"
if "import { Container" not in content:
    content = content.replace("import { Routes, Route, Link, useMatch } from 'react-router-dom'", 
                              "import { Routes, Route, Link, useMatch } from 'react-router-dom'\n" + imports_to_add)

# Refactor the HTML
content = content.replace('''      <div>
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
      </div>''', '''      <Container>
        <h2>Log in to application</h2>
        <Notification />
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
          <Button variant="primary" type="submit">login</Button>
        </Form>
      </Container>''')

content = content.replace('''  const Menu = () => (
    <div
      style={{ backgroundColor: 'lightgrey', padding: 10, marginBottom: 10 }}
    >
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      <span style={padding}>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </span>
    </div>
  )''', '''  const Menu = () => (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Blog App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">blogs</Nav.Link>
            <Nav.Link as={Link} to="/users">users</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text className="me-3">
              {user.name} logged in
            </Navbar.Text>
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )''')

content = content.replace('''  const UsersView = () => (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
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
      </table>
    </div>
  )''', '''  const UsersView = () => (
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
  )''')

content = content.replace('''      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div
            key={blog.id}
            style={{ border: 'solid 1px black', padding: 5, marginBottom: 5 }}
          >
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))}''', '''      <Togglable buttonLabel="new blog" ref={blogFormRef}>
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
      </Table>''')

content = content.replace('''  return (
    <div>
      <Menu />
      <h2>blog app</h2>
      <Notification />

      <Routes>''', '''  return (
    <Container>
      <Menu />
      <Notification />

      <Routes>''')
content = content.replace('''      </Routes>
    </div>
  )''', '''      </Routes>
    </Container>
  )''')


with open('src/App.jsx', 'w') as f:
    f.write(content)
print("Finished python replacement for UI styling in App.jsx")

import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'

const RegisterForm = ({ registerUser }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters')
      return
    }

    try {
      await registerUser({ username, name, password })
    } catch (_e) {
      setError('Registration failed. Username may already exist.')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>full name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          name="name"
          onChange={({ target }) => setName(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>confirm password</Form.Label>
        <Form.Control
          type="password"
          value={confirmPassword}
          name="confirmPassword"
          onChange={({ target }) => setConfirmPassword(target.value)}
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="success" type="submit">
        register
      </Button>
    </Form>
  )
}

export default RegisterForm

import { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Card className="mb-4">
      <Card.Header>Create New Blog</Card.Header>
      <Card.Body>
        <Form onSubmit={addBlog}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Enter title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={newAuthor}
              onChange={(event) => setNewAuthor(event.target.value)}
              placeholder="Enter author"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              placeholder="Enter URL"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            create
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default BlogForm
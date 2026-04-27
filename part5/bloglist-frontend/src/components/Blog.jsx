import { useState } from 'react'
import { Card, Button, ListGroup } from 'react-bootstrap'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null,
    }

    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog.id)
  }

  // blog.user puede ser un objeto {id, username, name} o un ObjectId string
  const blogUserId = blog.user?.id || blog.user
  const currentUserId = currentUser?.id
  console.log('DEBUG - blogUserId:', blogUserId, 'currentUserId:', currentUserId)
  const showDelete = blogUserId && currentUserId && blogUserId === currentUserId

  return (
    <tr className="blog">
      <td>
        <Card border="light" className="mb-2">
          <Card.Body>
            <Card.Title>
              {blog.title} - {blog.author}</Card.Title>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={toggleVisibility}
            >
              {visible ? 'hide' : 'view'}
            </Button>
            {visible && (
              <div className="blogDetails mt-3">
                <Card.Text>
                  <a href={blog.url} target="_blank" rel="noopener noreferrer">
                    {blog.url}
                  </a>
                </Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    likes {blog.likes}{' '}
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={handleLike}
                    >
                      like
                    </Button>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {blog.user ? blog.user.name : ''}
                  </ListGroup.Item>
                </ListGroup>
                {showDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={handleDelete}
                  >
                    remove
                  </Button>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </td>
    </tr>
  )
}

export default Blog
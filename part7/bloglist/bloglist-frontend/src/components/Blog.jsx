import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null
    }

    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog.id)
  }

  const showDelete =
    blog.user && currentUser && blog.user.username === currentUser.username

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user ? blog.user.name : ''}</div>
          {showDelete && (
            <button
              style={{ backgroundColor: 'lightblue' }}
              onClick={handleDelete}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog

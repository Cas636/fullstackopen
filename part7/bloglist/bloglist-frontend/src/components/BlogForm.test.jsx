import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'author test')
  await user.type(urlInput, 'http://testurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('author test')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testurl.com')
})

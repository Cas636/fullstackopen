import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let mockUpdate

  beforeEach(() => {
    const blog = {
      title: 'Testing React components',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: { username: 'testuser', name: 'Test User' }
    }

    mockUpdate = vi.fn()
    const mockDelete = vi.fn()
    const currentUser = { username: 'testuser' }

    container = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdate}
        deleteBlog={mockDelete}
        currentUser={currentUser}
      />
    ).container
  })

  test('renders title and author, but not url and likes by default', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Testing React components Test Author')
    expect(container.querySelector('.blogDetails')).toBeNull()
  })

  test('at start the children are not displayed', () => {
    const details = container.querySelector('.blogDetails')
    expect(details).toBeNull()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const details = container.querySelector('.blogDetails')
    expect(details).not.toBeNull()
    expect(details).toHaveTextContent('http://testurl.com')
    expect(details).toHaveTextContent('likes 5')
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdate.mock.calls).toHaveLength(2)
  })
})

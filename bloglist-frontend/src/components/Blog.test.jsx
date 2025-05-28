import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'testing',
    author: 'tester',
    url: 'test.com',
    likes: 10,
    user: {
      username: 'testinger',
      name: 'test testerson',
      blogs: [],
    }
  }

  const user = {
    username: 'testigner',
    name: 'test testerson',
    blogs: [],
  }

  let container
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} updateBlog={mockHandler} />).container
  })
  test('renders title', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('testing')
  })

  test('renders author', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('tester')
  })

  test('does not show url', () => {
    const div = container.querySelector('.visible')
    expect(div).not.toHaveTextContent('test.com')
  })

  test('does not show likes', () => {
    const div = container.querySelector('.visible')
    expect(div).not.toHaveTextContent('10')
  })

  test('does not show hidden section', () => {
    const div = container.querySelector('.hidden')
    expect(div).toHaveStyle('display: none;')
  })

  test('clicking the view button shows more information', async () => {
    const mockUser = userEvent.setup()
    const button = screen.getByText('view')
    await mockUser.click(button)

    const div = container.querySelector('.hidden')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking the view button shows the url', async () => {
    const mockUser = userEvent.setup()
    const button = screen.getByText('view')
    await mockUser.click(button)

    const div = container.querySelector('.hidden')
    expect(div).toHaveTextContent('test.com')
  })

  test('clicking the view button shows the likes', async () => {
    const mockUser = userEvent.setup()
    const button = screen.getByText('view')
    await mockUser.click(button)

    const div = container.querySelector('.hidden')
    expect(div).toHaveTextContent('10')
  })

  test('pressing like twice call the handler twice', async () => {
    const mockUser = userEvent.setup()
    const button = screen.getByText('view')
    await mockUser.click(button)

    const likeButton = screen.getByText('like')
    await mockUser.click(likeButton)
    await mockUser.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

describe('<BlogForm />', () => {
  let container
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(<BlogForm createBlog={mockHandler} />).container
  })

  test('correct details when handler is called', async () => {
    const mockUser = userEvent.setup()
    const button = screen.getByText('create')
    await mockUser.click(button)

    expect(mockHandler).toHaveBeenCalledWith({
      title: '',
      author: '',
      url: ''
    })
  })
})
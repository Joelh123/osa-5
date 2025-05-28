import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, expect } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'testing',
    author: 'tester',
    url: 'test.com',
    user: {
      username: 'fake',
      name: 'fake fakerson',
      blogs: [],
    }
  }

  const user = {
    username: 'testigner',
    name: 'test testerson',
    blogs: [],
  }

  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} />).container
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
    expect(div).not.toHaveTextContent('test.com')
  })

  test('does not show hidden section', () => {
    const div = container.querySelector('.hidden')
    expect(div).toHaveStyle('display: none;')
  })
})
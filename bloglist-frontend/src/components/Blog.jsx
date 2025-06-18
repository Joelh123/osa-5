import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [moreVisible, setMoreVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: moreVisible ? 'none' : '' }
  const hideWhenVisible = { display: moreVisible ? '' : 'none' }

  if (!blog) {
    return null
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={showWhenVisible} className='visible'>
        {blog.title} {blog.author} <button onClick={() => setMoreVisible(!moreVisible)}>view</button>
      </div>
      <div style={hideWhenVisible} className='hidden'>
        {blog.title} {blog.author} <button onClick={() => setMoreVisible(!moreVisible)}>hide</button>
        <div>{blog.url}</div>
        <div data-testid='likes'>{blog.likes} <button onClick={() => updateBlog(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {user.username === blog.user.username
          ? <button onClick={() => removeBlog(blog)}>remove</button>
          : null
        }
      </div>
    </div>
  )
}

export default Blog
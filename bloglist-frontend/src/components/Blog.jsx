import { useState } from "react"

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
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={() => setMoreVisible(!moreVisible)}>view</button>
      </div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={() => setMoreVisible(!moreVisible)}>hide</button>
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={() => updateBlog(blog)}>like</button></div>
        <div>{blog.author}</div>
        {user.username === blog.user.username
          ? <button onClick={() => removeBlog(blog)}>remove</button>
          : null
        }
      </div>
    </div>  
  )
}

export default Blog
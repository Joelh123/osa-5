import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    if (!(blogObject.title || blogObject.author || blogObject.url)) {
      setErrorMessage('Fill every field')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return null
    }

    setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateBlog = (blog) => {
    blogService
      .update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user._id
      })
      .then(response => {
        const updatedBlog = {
          ...response,
          user: typeof response.user === 'object' ? response.user : blog.user
        }
        setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog).sort((a, b) => b.likes - a.likes))
      })
  }

  const removeBlog = (blogToRemove) => {
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)) {
      blogService
        .remove(blogToRemove.id)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
        })

      setNotification(`${blogToRemove.title} has been deleted`)

      setTimeout(() => {
        setNotification('')
      }, 5000)
    } else {
      return null
    }
  }

  const loginForm = () => (
    <>
      <h1 data-testid='login-header'>Login</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <LoginForm handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} username={username} password={password} />
    </>
  )


  const blogForm = user => { console.log(JSON.stringify(blogs)); return (
    <div>
      <h1>blogs</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
      )}
    </div>
  )}

  return (
    <div>
      {user === null
        ? loginForm()
        : blogForm(user)
      }
    </div>
  )
}

export default App
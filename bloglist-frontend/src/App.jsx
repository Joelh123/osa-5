import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      }, 2500)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = (blogObject) => {

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    if (!(blogObject.title || blogObject.author || blogObject.url)) {
      setErrorMessage('Fill every field')

      setTimeout(() => {
        setErrorMessage(null)
      }, 2500)
      return null
    }

    setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)

    setTimeout(() => {
      setNotification(null)
    }, 2500)
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
        setBlogs(blogs.map(blog => blog.id === response.id ? response : blog).sort((a, b) => b.likes - a.likes))
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <div>
        username
          <input 
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input 
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = user => (
    <div>
      <h1>blogs</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel={'new blog'}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
      )}
    </div>
  )

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
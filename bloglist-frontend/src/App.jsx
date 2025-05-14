import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const createBlog = (event) => {
    event.preventDefault()
    
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <h2>blogs</h2>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <p>title: <input type='text' value={title} name='Title' onChange={({ target }) => setTitle(target.value)} /></p>
        <p>author: <input type='text' value={author} name='Author' onChange={({ target }) => setAuthor(target.value)} /></p>
        <p>url: <input type='text' value={url} name='Url' onChange={({ target }) => setUrl(target.value)} /></p>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
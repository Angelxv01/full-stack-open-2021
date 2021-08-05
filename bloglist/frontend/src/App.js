import './index.css'

import React, { useState, useEffect, useRef } from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
// import { decode } from 'jsonwebtoken'
import { useDispatch, useSelector } from 'react-redux'

import userService from './services/user'

// import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogpost from './components/AddBlogpost'
import Message from './components/Message'
import User from './components/User'
import BlogPost from './components/BlogPost'

import Togglable from './components/Togglable'

import { setNotification } from './reducers/notificationReducer'
import {
  addBlog,
  // deleteBlog,
  initBlogs,
  likeBlog
} from './reducers/blogReducer'
import { loadUser, loginUser } from './reducers/userReducer'
import Users from './components/Users'
import Navigation from './components/Navigation'

const App = () => {
  const [time, setTime] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((res) => setUsers(res))
  }, [])

  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blog)
  const user = useSelector((state) => state.user)

  const matchUser = useRouteMatch('/users/:id')
  const selectedUser = matchUser
    ? users.find((obj) => obj.id === matchUser.params.id)
    : null

  const matchBlog = useRouteMatch('/blogs/:id')
  const selectedBlog = matchBlog
    ? blogs.find((obj) => obj.id === matchBlog.params.id)
    : null

  const addBlogpostRef = useRef()

  const handleLogin = async (credentials) => {
    try {
      dispatch(loginUser(credentials))
    } catch (error) {
      handleMessage(error.response.data.error, 'error')
    }
  }

  const handleCreate = async (title, author, url) => {
    const data = { title, author, url }
    addBlogpostRef.current.toggleVisibility()
    const res = await dispatch(addBlog(data))
    handleMessage(`a new blog ${res.title} by ${res.author} added`)
  }

  const handleMessage = async (message, type = 'success') => {
    const id = await dispatch(setNotification({ message, type }, 5, time))
    setTime(id)
  }

  const putLike = async (id, blogToUpdate) => {
    dispatch(likeBlog(id, blogToUpdate))
  }

  // const removeBlog = (id) => {
  //   try {
  //     dispatch(deleteBlog(id))
  //   } catch (err) {
  //     return handleMessage(err.response.data.error, 'error')
  //   }
  // }

  useEffect(() => {
    dispatch(initBlogs())
  }, [])

  useEffect(() => {
    dispatch(loadUser())
    // const loggedUserJSON = window.localStorage.getItem('loggedUser')
    // if (loggedUserJSON) {
    //   const user = JSON.parse(loggedUserJSON)
    //   blogService.setToken(user.token)
    //   const { exp } = decode(user.token)
    //   const expired = Date.now() >= exp * 1000 - 60000
    //   expired ? logout() : setUser(user)
    // }
  }, [])

  if (user === null) {
    return (
      <>
        <h2>log in to application</h2>
        <Message />
        <LoginForm handleLogin={handleLogin} />
      </>
    )
  }

  return (
    <div>
      <Navigation />
      <h2>blogs</h2>
      <Message />

      <Switch>
        <Route path="/users/:id">
          <User user={selectedUser} />
        </Route>
        <Route path="/blogs/:id">
          <BlogPost blog={selectedBlog} putLike={putLike} />
        </Route>
        <Route path="/users">
          <Users users={users} />
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create" ref={addBlogpostRef}>
            <AddBlogpost handleCreate={handleCreate} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <div key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </div>
              // <Blog
              //   key={blog.id}
              //   blog={blog}
              //   putLike={putLike}
              //   removeBlog={removeBlog}
              //   isCreator={user.username === blog.user.username}
              // />
            ))}
        </Route>
      </Switch>
    </div>
  )
}

export default App

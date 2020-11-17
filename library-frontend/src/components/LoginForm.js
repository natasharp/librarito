import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN, CURRENT_USER } from '../queries'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, tokenResult] = useMutation(LOGIN)
  const [getCurrentUser, userResult] = useLazyQuery(CURRENT_USER, {fetchPolicy: "no-cache"})

  useEffect(() => {
    if (tokenResult.data) {
      const token = tokenResult.data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
      getCurrentUser()
    }
  }, [tokenResult.data]) // eslint-disable-line

  useEffect(() => {
    if (userResult.data) {
      props.setUser(userResult.data.me)
      
    }
  }, [userResult.data])  // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    props.setPage('authors')
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm

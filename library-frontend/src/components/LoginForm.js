import { useLazyQuery, useMutation } from '@apollo/client'
import { Button, Card, makeStyles, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { LOGIN, CURRENT_USER } from '../queries'
import { useHistory } from 'react-router-dom'

const useStyle = makeStyles({
  root: {
    padding: 8,
  },
  cardStyle: {
    marginTop: 8,
    padding: 8,
    overflow: 'visible'
  },
  textFieldStyle: {
    paddingTop: 8,
    marginTop: 8
  },
  buttonStyle: {
    marginTop: 8
  },
});

const LoginForm = (props) => {
  const classes = useStyle()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, tokenResult] = useMutation(LOGIN)
  const [getCurrentUser, userResult] = useLazyQuery(CURRENT_USER, { fetchPolicy: "no-cache" })


  useEffect(() => {
    if (tokenResult.data) {
      const token = tokenResult.data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
      getCurrentUser()
    }
  }, [tokenResult.data]) // eslint-disable-line

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (userResult.data && token) {
      props.setUser(userResult.data.me)
    } else {
      console.log('token is not defined')
    }
  }, [userResult])  // eslint-disable-line


  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    history.push('/authors')
  }

  return (
    <div>
      <Card className={classes.cardStyle} variant='outlined'>
        <form onSubmit={submit}>
          <TextField
            fullWidth
            name='Username'
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            label='Username'
            variant='outlined'>
          </TextField>
          <TextField
            fullWidth
            name='Password'
            type='password'
            value={password}
            label='Password'
            variant='outlined'
            className={classes.textFieldStyle}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button className={classes.buttonStyle} variant='contained' color='primary' type='submit'>LOGIN</Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginForm

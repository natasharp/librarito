import { useMutation } from '@apollo/client'
import { Box, Button, Card, makeStyles, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'

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
  box: {
    display: "flex",
    marginRight: 8
  },
  bottomLeftBox: {
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
});

const LoginForm = ({ setToken }) => {
  const classes = useStyle()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, tokenResult] = useMutation(LOGIN)

  useEffect(() => {
    if (tokenResult.data) {
      const token = tokenResult.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [tokenResult.data, setToken])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <Card className={classes.cardStyle} variant='outlined'>
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
        </Card>
        <Box
          className={`${classes.bottomLeftBox} ${classes.box}`}>
          <Button
            className={classes.buttonStyle}
            variant='contained'
            color='primary'
            type='submit'>
            LOGIN
              </Button>
        </Box>
      </form>
    </div>
  )
}

export default LoginForm
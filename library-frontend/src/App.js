import { useApolloClient } from '@apollo/client'
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    setPage('login')
    localStorage.clear()
    client.resetStore()
  }

  const hideWhenLogedIn = { display: token ? 'none' : '' }
  const showWhenLogedIn = { display: token ? '' : 'none' }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button style={hideWhenLogedIn} onClick={() => setPage('login')}>
          login
        </button>
        <button style={showWhenLogedIn} onClick={() => setPage('add')}>
          add book
        </button>
        <button style={showWhenLogedIn} onClick={() => setPage('recommend')}>
          recommend
        </button>
        <button style={showWhenLogedIn} onClick={() => logout()}>
          logout
        </button>
      </div>

      <Authors show={page === 'authors'} showWhenLogedIn={showWhenLogedIn} />

      <Books show={page === 'books'} page={page} />

      <NewBook show={page === 'add'} />

      <Books show={page === 'recommend'} page={page} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  )
}

export default App

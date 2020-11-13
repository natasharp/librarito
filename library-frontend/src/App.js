import { useApolloClient, useLazyQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import RecommendedBooks from './components/RecommendedBooks'
import { ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [recommendedBooks, setBooks] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const client = useApolloClient()

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  const hideWhenLogedIn = { display: token ? 'none' : '' }
  const showWhenLogedIn = { display: token ? '' : 'none' }

  const showRecommendations = () => {
    getBooks({ variables: { genre: user.favoriteGenre } })
    setPage('recommend')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
    setPage('login')
    client.clearStore()
  }


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
        <button style={showWhenLogedIn} onClick={() => showRecommendations()}>
          recommend
        </button>
        <button style={showWhenLogedIn} onClick={() => logout()}>
          logout
        </button>
      </div>

      <Authors show={page === 'authors'} showWhenLogedIn={showWhenLogedIn} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <RecommendedBooks show={page === 'recommend'} books={recommendedBooks} user={user}/>

      <LoginForm
        show={page === 'login'}
        user={user}
        setToken={setToken}
        setPage={setPage}
        setUser={setUser}
      />
    </div>
  )
}

export default App

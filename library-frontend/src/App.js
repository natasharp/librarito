import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import RecommendedBooks from './components/RecommendedBooks'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const client = useApolloClient()
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded
      alert(`New book added: ${book.title}, ${book.author.name}`)
      updateCacheWith(book)
    }
  })

  useEffect(() => {
    if (result.data) {
      setRecommendedBooks(result.data.allBooks)
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
    setPage('login')
    localStorage.clear()
    client.resetStore()
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    const booksInStore = client.readQuery({ query: ALL_BOOKS })
    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: booksInStore.allBooks.concat(addedBook) }
      })
    }
    if (!includedIn(authorsInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: authorsInStore.allAuthors.concat(addedBook.author) }
      })
    }
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

      <RecommendedBooks show={page === 'recommend'} books={recommendedBooks} user={user} />

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

import { useApolloClient, useLazyQuery, useQuery, useSubscription } from '@apollo/client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import RecommendedBooks from './components/RecommendedBooks'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from './queries'
import {
  Switch, Route, Link, useHistory
} from "react-router-dom"
import { AppBar, Button, Container, makeStyles, Tab, Tabs } from '@material-ui/core'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const App = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tabValue, setTabValue] = React.useState(0);
  
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [getCurrentUser, userResult] = useLazyQuery(CURRENT_USER, { fetchPolicy: "no-cache" })
  const [user, setUser] = useState(null)
  
  const booksResult = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const authorsResult = useQuery(ALL_AUTHORS)
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const client = useApolloClient()

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded
      alert(`New book added: ${book.title}, ${book.author.name}`)
      // if (book.genres.filter(genre => genre === user.favoriteGenre)) {
      //   setRecommendedBooks(recommendedBooks.concat(book))
      // }
      updateCacheWith(book)
    }
  })

  useEffect(() => {
    if (token) {
      getCurrentUser()
    }
  }, [token, getCurrentUser])

  useEffect(() => {
    if (userResult.data && token) {
      setUser(userResult.data.me)
      history.push('/authors')
    }
  }, [userResult])  // eslint-disable-line

  useEffect(() => {
    if (authorsResult.data) {
      setAuthors(authorsResult.data.allAuthors)
    }
  }, [authorsResult.data])

  useEffect(() => {
    if (booksResult.data) {
      setBooks(booksResult.data.allBooks)
    }
  }, [booksResult])

  useEffect(() => {
    if (user) {
      getBooks({ variables: { genre: user.favoriteGenre } })
    }
  }, [user, getBooks])

  useEffect(() => {
    if (result.data) {
      setRecommendedBooks(result.data.allBooks)
    }
  }, [result.data])

  const logout = () => {
    setToken(null)
    setUser(null)
    setTabValue(2)
    localStorage.clear()
    client.resetStore()
    history.push('/')
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
    <Container>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="AUTHORS" {...a11yProps(0)} component={Link} to={"/authors"} />
            <Tab label="BOOKS" {...a11yProps(1)} component={Link} to={"/books"} />
            {user ? <Tab {...a11yProps(2)} label="NEW BOOK" component={Link} to={"/newBook"} /> : null}
            {user ? <Tab {...a11yProps(3)} label="RECOMENDED BOOKS" component={Link} to={"/recomendedBooks"} /> : null}
            {user ? <Tab label="LOGOUT" {...a11yProps(4)} component={Button} onClick={logout} /> : <Tab label="LOGIN" {...a11yProps(4)} component={Link} to={"/"} />}
          </Tabs>
        </AppBar>
      </div>
      <Switch>
        <Route path="/authors" render={() => <Authors user={user} authors={authors} />} />
        <Route path="/books" render={() => <Books books={books} />} />
        <Route path="/recomendedBooks" render={() => <RecommendedBooks books={recommendedBooks} user={user} />} />
        <Route path="/newBook" render={() => <NewBook />} />
        <Route path="/" render={() => <LoginForm setTabValue={setTabValue} user={user} token={token}
          setToken={setToken}
          setUser={setUser} />} />
      </Switch>
    </Container>
  )
}

export default App

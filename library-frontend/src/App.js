import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import RecommendedBooks from './components/RecommendedBooks'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import {
  BrowserRouter as Router, Switch, Route, Link
} from "react-router-dom"
import { AppBar, Container, makeStyles, Tab, Tabs } from '@material-ui/core'

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
  const [value, setValue] = React.useState(0);
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const client = useApolloClient()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
  }

  const logout = () => {
    setToken(null)
    setUser(null)
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
    <Container>
      <Router>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="AUTHORS" {...a11yProps(0)} component={Link} to={"/authors"} />
              <Tab label="BOOKS" {...a11yProps(1)} component={Link} to={"/books"} />
              <Tab label="LOGIN" {...a11yProps(2)} component={Link} to={"/login"} />
            </Tabs>
          </AppBar>
        </div>
        <Switch>
          <Route path="/authors" render={() => <Authors />} />
          <Route path="/books" render={() => <Books />} />
          <Route path="/login" render={() => <LoginForm />} />
          <Route path="/recomendedBooks" user={user} render={() => <LoginForm />} />
          <Route path="/newBook" render={() => <NewBook />} />
          <Route path="/login" render={() => <LoginForm user={user}
            setToken={setToken}
            setUser={setUser} />} />
        </Switch>
      </Router>
    </Container>
  )
}

export default App

import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [publishedYear, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [addBook] = useMutation(ADD_BOOK, {
    update: (store, response) => {
      try {
        const booksInStore = store.readQuery({ query: ALL_BOOKS })
        store.writeQuery({
          query: ALL_BOOKS,
          data: {
            ...booksInStore,
            allBooks: [...booksInStore.allBooks, response.data.addBook],
          },
        })
        const authorsInStore = store.readQuery({ query: ALL_AUTHORS })
        store.writeQuery({
          query: ALL_AUTHORS,
          data: {
            ...authorsInStore,
            allAuthors: [...authorsInStore.allAuthors, response.data.addBook.author],
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const published = parseInt(publishedYear)
    addBook({ variables: { title, published, author, genres } })

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={publishedYear}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
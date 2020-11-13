import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'
import Filter from './Filter'
import TableOfBooks from './TableOfBooks'

const Books = ({ show }) => {
  const [filter, setFilter] = useState('all genres')
  const [books, setBooks] = useState([])
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!show) {
    return null
  }

  const booksByGenre =
    filter === 'all genres'
      ? books
      : books.filter((b) => b.genres.includes(filter))

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <strong>{filter}</strong>
      </div>
      <TableOfBooks books={booksByGenre} />
      <Filter books={books} setFilter={setFilter} />
    </div>
  )
}

export default Books

import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'
import Filter from './Filter'
import CustomTable from './CustomTable'

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

  const tableHeaderData = [{ title: 'TITLE' }, { title: 'AUTHOR' }, { title: 'PUBLISHED' }]

  return (
    <div>
      <Filter books={books} setFilter={setFilter} filter={filter}/>
      <CustomTable dataList={booksByGenre} headerList={tableHeaderData} />
    </div>
  )
}
export default Books

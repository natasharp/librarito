import React, { useState } from 'react'
import Filter from './Filter'
import CustomTable from './CustomTable'

const Books = ({books}) => {
  const [filter, setFilter] = useState('all genres')

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

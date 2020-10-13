import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'
import { ME } from '../queries'
import Filter from './Filter'

const Books = ({ page, show }) => {
  const [filter, setFilter] = useState('all genres')
  const result = useQuery(ALL_BOOKS)
  const userResult = useQuery(ME)

  if (!show) {
    return null
  }

  let books = []
  if (result.data) {
    books = result.data.allBooks
  }

  let booksByGenre = []
  if (page === 'recommend' && userResult.data) {
    const genre = userResult.data.me.favoriteGenre
    booksByGenre = books.filter((b) => b.genres.includes(genre))
  } else {
    booksByGenre =
      filter === 'all genres'
        ? books
        : books.filter((b) => b.genres.includes(filter))
  }

  return (
    <div>
      <div>
        {page === 'recommend' ? (
          <div>
            <h2>recommendations</h2>
            books in your favorite genre{' '}
            <strong>{userResult.data.me.favoriteGenre}</strong>
          </div>
        ) : (
          <div>
            <h2>books</h2>
            <div>
              in genre <strong>{filter}</strong>
            </div>
          </div>
        )}
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {page === 'recommend' ? null : (
        <Filter books={books} setFilter={setFilter} />
      )}
    </div>
  )
}

export default Books

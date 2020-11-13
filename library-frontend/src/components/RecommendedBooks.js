import React from 'react'
import TableOfBooks from './TableOfBooks'

const RecommendedBooks = (props) => {
  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre{' '}
        <strong>{props.user.favoriteGenre}</strong>
      </div>
      <TableOfBooks books={props.books} />
    </div>
  )
}

export default RecommendedBooks

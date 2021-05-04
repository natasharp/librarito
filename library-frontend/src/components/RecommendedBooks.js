import React from 'react'
import CustomTable from './CustomTable'

const RecommendedBooks = (props) => {
  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre{' '}
        <strong>{props.user.favoriteGenre}</strong>
      </div>
      <CustomTable books={props.books} />
    </div>
  )
}

export default RecommendedBooks

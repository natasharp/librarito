import React from 'react'

const Filter = (props) => {
  const genres = props.books
    .map((b) => b.genres)
    .flat()
    .concat('all genres')
  const distinctGenres = [...new Set(genres)]

  return (
    <div>
      {distinctGenres.map((genre) => (
        <button key={genre} onClick={() => props.setFilter(genre)}>
          {genre}
        </button>
      ))}
    </div>
  )
}

export default Filter

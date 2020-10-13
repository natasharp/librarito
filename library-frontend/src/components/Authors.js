import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  const [birthyear, setBirthyear] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [updateBirthyear] = useMutation(EDIT_AUTHOR)
  const result = useQuery(ALL_AUTHORS)
  const options = authors.map((a) => ({ value: a, label: a.name }))

  useEffect(() => {
    if (result.data) {
      setAuthors(result.data.allAuthors)
    }
  }, [result.data])

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    if (!selectedAuthor || !birthyear) {
      return null
    }

    const born = parseInt(birthyear)
    updateBirthyear({ variables: { name: selectedAuthor.label, born } })
    setSelectedAuthor('')
    setBirthyear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={props.showWhenLogedIn}>
      <h3>Set birthyear</h3>
      <Select
        value={selectedAuthor}
        onChange={setSelectedAuthor}
        options={options}
      />
      <form onSubmit={submit}>
        <div>
          born
          <input
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
      </div>
    </div>
  )
}

export default Authors

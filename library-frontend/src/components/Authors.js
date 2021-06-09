import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { EDIT_AUTHOR } from '../queries'
import { Button, Card, makeStyles, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    padding: 8
  },
  cardStyle: {
    marginTop: 8,
    padding: 8,
    overflow: "visible"
  },
  textFieldStyle: {
    paddingTop: 8,
    marginTop: 8
  },
  buttonStyle: {
    marginTop: 8
  },
  bold: {
    fontWeight: 800
  },
  boldHeading: {
    fontWeight: 800,
    padding: 8
  }
});

const Authors = (props) => {
  const classes = useStyles()

  const [birthyear, setBirthyear] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [updateBirthyear] = useMutation(EDIT_AUTHOR)

  const options = props.authors.map((a) => ({ value: a, label: a.name }))



  const submit = (event) => {
    event.preventDefault()

    if (!selectedAuthor || !birthyear) {
      return null
    }

    const born = parseInt(birthyear)
    updateBirthyear({ variables: { name: selectedAuthor.name, born } })
    setSelectedAuthor('')
    setBirthyear('')
  }

  const handleSelectAuthor = ({ target }) => {
    setSelectedAuthor(target.value)
  }

  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table aria-label='simple-table'>
          <TableHead>
            <TableRow >
              <TableCell className={classes.bold}>AUTHOR</TableCell>
              <TableCell className={classes.bold}>DATE OF BIRTH</TableCell>
              <TableCell className={classes.bold}>NUMBER OF BOOKS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.authors.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.born}</TableCell>
                <TableCell>{row.bookCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {props.user ?
        <Card className={classes.cardStyle} variant='outlined'>
          <Typography variant="button" display="block" gutterBottom className={classes.boldHeading}>
            SET YEAR OF BIRTH
          </Typography>
          <form onSubmit={submit}>
            <TextField
              select
              fullWidth
              value={selectedAuthor}
              onChange={handleSelectAuthor}
              label='Author'
              variant='outlined'>
              {options.map((option) =>
                <MenuItem key={option.value.id} value={option.value}>{option.label}</MenuItem>
              )}
            </TextField>
            <TextField
              fullWidth
              name='yearOfBirth'
              type='text'
              value={birthyear}
              label='Year of birth'
              variant='outlined'
              className={classes.textFieldStyle}
              onChange={({ target }) => setBirthyear(target.value)}
            />
            <Button className={classes.buttonStyle} variant='contained' color='primary' type='submit'>Update</Button>
          </form>
        </Card> : null}
    </div >
  )
}

export default Authors

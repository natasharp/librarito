import { useMutation } from '@apollo/client'
import { Box, Button, Card, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import { ADD_BOOK } from '../queries'

const useStyle = makeStyles({
  root: {
    padding: 8,
  },
  cardStyle: {
    marginTop: 8,
    padding: 8,
    overflow: 'visible'
  },
  textFieldStyle: {
    paddingTop: 10,
    marginTop: 8
  },
  buttonStyle: {
    marginTop: 17,
    paddingTop: 15,
    paddingBottom: 15,
    padding: 0
  },
  button: {
    margin: 10,
  },
  textStyle: {
    padding: 8,
    fontWeight: 600
  },
  box: {
    display: "flex"
  },
  bottomLeftBox: {
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  gridStyle: {
    direction: "column",
  }
});

const NewBook = (props) => {
  const classes = useStyle()
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [publishedYear, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

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
    <div className={classes.root}>
      <form onSubmit={submit}>
        <Card className={classes.cardStyle} variant='outlined'>
          <TextField
            fullWidth
            name='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            label='Title'
            variant='outlined'>
          </TextField>
          <TextField
            className={classes.textFieldStyle}
            fullWidth
            name='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
            label='Author'
            variant='outlined'>
          </TextField>
          <TextField
            className={classes.textFieldStyle}
            fullWidth
            name='published'
            type='number'
            value={publishedYear}
            onChange={({ target }) => setPublished(target.value)}
            label='Published'
            variant='outlined'>
          </TextField>
          <Grid container className={classes.gridStyle} spacing={1}>
            <Grid item xs={8} md={10} >
              <TextField
                className={classes.textFieldStyle}
                fullWidth
                name='genre'
                type='text'
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
                label='Genre'
                variant='outlined'>
              </TextField>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button
                fullWidth
                onClick={addGenre}
                className={classes.buttonStyle}
                variant='outlined'
                color='default'
                type='button'>
                ADD GENRE
              </Button>
            </Grid>
          </Grid>
          <Typography
            variant="button"
            display="block"
            gutterBottom
            className={classes.textStyle}>
            {genres.join(' ')}
          </Typography>
        </Card >
        <Box className={`${classes.bottomLeftBox} ${classes.box}`}>
          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            type='submit'>
            ADD NEW BOOK
          </Button>
        </Box>
      </form>
    </div >
  )
}

export default NewBook

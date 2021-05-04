import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import React from 'react'

const useStyle = makeStyles({
  root: {
    padding: 8
  },
  textFieldStyle: {
    paddingTop: 8,
    marginTop: 8
  },
});

const Filter = (props) => {
  const classes = useStyle()

  const genres = props.books
    .map((b) => b.genres)
    .flat()
    .concat('all genres')

  const distinctGenres = [...new Set(genres)]

  const handleSelection = (event) => props.setFilter(event.target.value)

  return (
    <div className={classes.root}>
      <TextField
        className={classes.textFieldStyle}
        select
        fullWidth
        value={props.filter}
        onChange={handleSelection}
        label='Genre'
        variant='outlined'>
        {distinctGenres.map((option) =>
          <MenuItem key={option} value={option}>{option}</MenuItem>
        )}
      </TextField>
    </div>
  )
}

export default Filter

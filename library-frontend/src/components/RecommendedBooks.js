import { Card, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import CustomTable from './CustomTable'

const useStyle = makeStyles({
  root: {
    padding: 8,
  },
  cardStyle: {
    marginTop: 8,
    padding: 8,
    overflow: 'visible'
  },
  boldHeading: {
    fontWeight: 800,
    padding: 10
  }
})

const RecommendedBooks = ({user, books}) => {
  const classes = useStyle()
  const tableHeaderData = [{ title: 'TITLE' }, { title: 'AUTHOR' }, { title: 'PUBLISHED' }]

  if (user) {
    return (
      <div className={classes.root}>
        <Card className={classes.cardStyle}>
          <Typography variant="button" display="block" gutterBottom className={classes.boldHeading}>
            BOOKS IN YOUR FAVOURITE GENRE - {user.favoriteGenre}
          </Typography>
          <CustomTable dataList={books} headerList={tableHeaderData} />
        </Card>
      </div>
    )
  } else {
    return null
  }
}

export default RecommendedBooks

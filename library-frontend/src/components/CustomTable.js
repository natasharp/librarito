import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
  root: {
    padding: 8
  },
  bold: {
    fontWeight: 700
  }
})

const CustomTable = ({ dataList, headerList }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table aria-label='simple-table'>
          <TableHead>
            <TableRow >
              {headerList.map((row) => (
                <TableCell key={row.title} className={classes.bold}>{row.title}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.author.name}</TableCell>
                <TableCell>{row.published}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default CustomTable

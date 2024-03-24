// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

const createData = (tennhanvien, manhanvien, anh, hanhdong) => {
  return { tennhanvien, manhanvien, anh, hanhdong }
}

const rows = [
 
]

const TableDense = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
        <TableHead>
          <TableRow>
            <TableCell>Tên nhân viên </TableCell>
            <TableCell align='right'>Mã Nhân viên</TableCell>
            <TableCell align='right'>Ảnh </TableCell>
            <TableCell align='right'>xxx </TableCell>
            <TableCell align='right'>Hành động </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.tennhanvien}</TableCell>
              <TableCell align='right'>{row.manhanvien}</TableCell>
              <TableCell align='right'>{row.anh}</TableCell>
              <TableCell align='right'>{row.hanhdong}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableDense
// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'



const RecognitionLogsList = (props) => {
  const {recognitionlogList} = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align='center'>Mã nhân viên </TableCell>
            <TableCell align='center'>Cập nhật bởi</TableCell>
            <TableCell align='center'>Thời gian</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recognitionlogList.map(row => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell align='center'>{row.id}</TableCell>
              <TableCell align='center'>{row.employee_id}</TableCell>
              <TableCell align='center'>{row.camera_name}</TableCell>
              <TableCell align='center'>{row.datetime}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RecognitionLogsList
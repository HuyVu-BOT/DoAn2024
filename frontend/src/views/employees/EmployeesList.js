// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faXmark,
  faPencil
} from "@fortawesome/free-solid-svg-icons";


const EmployeesList = (props) => {
  const {employeeList, handleDelete, handleUpdate} = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Mã nhân viên</TableCell>
            <TableCell align='center'>Tên nhân viên</TableCell>
            <TableCell align='center'>Ảnh</TableCell>
            <TableCell align='center'>Phòng ban</TableCell>
            <TableCell align='center'>Cập nhật bởi</TableCell>
            <TableCell align='center'>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeList.map(row => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell align='center'>{row.id}</TableCell>
              <TableCell align='center'>{row.full_name}</TableCell>
              <TableCell align='center'><Image width={100} height={100} className='mt-3' src={row.face_image} alt='Preview' /></TableCell>
              <TableCell align='center'>{row.department_name}</TableCell>
              <TableCell align='center'>{row.updated_by}</TableCell>
              <TableCell align='center'>
                <a
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleUpdate(row)}
                >
                  <FontAwesomeIcon icon={faPencil} /> Cập nhật
                </a>{" "}
                <a
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(row.id)}
                >
                  <FontAwesomeIcon icon={faXmark} /> Xóa
                </a>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default EmployeesList
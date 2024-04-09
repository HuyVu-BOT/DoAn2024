// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
// ** Demo Components Imports
import TableBasic from 'src/views/employees/EmployeesList'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EmployeeFormModal from 'src/views/employees/EmployeeFormModal'
import { blankEmployee } from 'src/models/employees'
import { AlertContext } from 'src/context'
import request from "src/lib/api"

const EmployeesManagement = () => {
  const router = useRouter()
  const [showCreatingModal, setShowCreatingModal] = useState(false)
  const [employeeInfo, setEmployeeInfo] = useState({ ...blankEmployee })
  const { alert, setAlert } = useContext(AlertContext)

  const createEmployee = async e => {
    e.stopPropagation()
    e.preventDefault()
    if (router.isReady) {
      const request_body = JSON.stringify(employeeInfo)
      const res = await request('POST', 'employees', router, request_body, setAlert, 'Tạo nhân viên mới thành công!')
      if (res && res.status === 200) {
        console.log(res.data)
        setEmployeeInfo({
          ...blankEmployee
        })
        setShowCreatingModal(false)
      }
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            Quản lý Nhân viên
          </Typography>
          <Typography variant='body2'>
            <Button variant='contained' startIcon={<AddIcon />} onClick={() => setShowCreatingModal(true)}>
              {' '}
              Thêm nhân viên{' '}
            </Button>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Danh sách nhân viên' titleTypographyProps={{ variant: 'h6' }} />
            <TableBasic />
          </Card>
        </Grid>
      </Grid>
      <EmployeeFormModal
        showCreatingModal={showCreatingModal}
        setShowCreatingModal={setShowCreatingModal}
        employeeInfo={employeeInfo}
        setEmployeeInfo={setEmployeeInfo}
        handleSubmit={createEmployee}
        isCreating={true}
      />
    </>
  )
}

export default EmployeesManagement

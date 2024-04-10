// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// ** Demo Components Imports
import EmployeesList from 'src/views/employees/EmployeesList'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EmployeeFormModal from 'src/views/employees/EmployeeFormModal'
import { blankEmployee } from 'src/models/employees'
import { AlertContext } from 'src/context'
import request from 'src/lib/api'

const EmployeesManagement = () => {
  const router = useRouter()
  const [showEmployeeFormModal, setShowEmployeeFormModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [employeeInfo, setEmployeeInfo] = useState({ ...blankEmployee })
  const [employeeList, setEmployeeList] = useState([])
  const { alert, setAlert } = useContext(AlertContext)

  useEffect(() => {
    getEmployees()
  }, [])

  const getEmployees = async () => {
    if (router.isReady) {
      const res = await request('GET', 'employees', router)
      if (res && res.status === 200) {
        console.log(res.data)
        setEmployeeList(res.data.employees)
      }
    }
  }

  const createEmployee = async () => {
    if (router.isReady) {
      const request_body = JSON.stringify(employeeInfo)
      const res = await request('POST', 'employees', router, request_body, setAlert, 'Tạo nhân viên mới thành công!')
      if (res && res.status === 200) {
        console.log(res.data)
        setEmployeeInfo({
          ...blankEmployee
        })
        setShowEmployeeFormModal(false)
      }
    }
  }

  const handleCreateEmployee = () => {
    setIsCreating(true)
    setShowEmployeeFormModal(true)
  }

  const handleUpdateEmployee = (employee_data) => {
    let updatedEmployeeInfo = {...blankEmployee}
    updatedEmployeeInfo.department_id = employee_data.department_id
    updatedEmployeeInfo.id = employee_data.id
    updatedEmployeeInfo.full_name = employee_data.full_name
    updatedEmployeeInfo.face_image = employee_data.face_image
    setEmployeeInfo(updatedEmployeeInfo)
    setIsCreating(false)
    setShowEmployeeFormModal(true)
  }

  const updateEmployee = async () => {
    if (router.isReady) {
      const request_body = JSON.stringify(employeeInfo)
      const res = await request('PUT', 'employees', router, request_body, setAlert, 'Cập nhật nhân viên thành công!')
      if (res && res.status === 200) {
        console.log(res.data)
        setEmployeeInfo({
          ...blankEmployee
        })
        setShowEmployeeFormModal(false)
      }
    }
  }

  const handleDeleteEmployee = async (employee_id) => {
    if (router.isReady) {
      const res = await request('DELETE', `employees/${employee_id}`, router, null, setAlert, 'Xóa nhân viên thành công!')
      if (res && res.status === 200) {
        getEmployees();
      }
    }
  }

  const handleSubmit = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if(isCreating){
      createEmployee()
    } else {
      updateEmployee()
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
            <Button variant='contained' startIcon={<AddIcon />} onClick={() => handleCreateEmployee()}>
              {' '}
              Thêm nhân viên{' '}
            </Button>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Danh sách nhân viên' titleTypographyProps={{ variant: 'h6' }} />
            <EmployeesList 
            employeeList={employeeList}
            handleDelete={handleDeleteEmployee}
            handleUpdate={handleUpdateEmployee}
            />
          </Card>
        </Grid>
      </Grid>
      <EmployeeFormModal
        showEmployeeFormModal={showEmployeeFormModal}
        setShowEmployeeFormModal={setShowEmployeeFormModal}
        employeeInfo={employeeInfo}
        setEmployeeInfo={setEmployeeInfo}
        handleSubmit={handleSubmit}
        isCreating={isCreating}
      />
    </>
  )
}

export default EmployeesManagement

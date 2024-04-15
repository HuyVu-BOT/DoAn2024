// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// ** Demo Components Imports
import DepartmentsList from 'src/views/departments/DepartmentList'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DepartmentFormModal from 'src/views/departments/DepartmentFormModal'
import { blankDepartment } from 'src/models/departments'
import { AlertContext } from 'src/context'
import request from 'src/lib/api'

const DepartmentsManagement = () => {
  const router = useRouter()
  const [showDepartmentFormModal, setShowDepartmentFormModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [departmentInfo, setDepartmentInfo] = useState({ ...blankDepartment })
  const [departmentList, setDepartmentList] = useState([])
  const { alert, setAlert } = useContext(AlertContext)

  useEffect(() => {
    getDepartments()
  }, [])

  const getDepartments = async () => {
    if (router.isReady) {
      const res = await request('GET', 'departments', router)
      if (res && res.status === 200) {
        console.log(res.data)
        setDepartmentList(res.data.departments)
      }
    }
  }

  const createDepartment = async () => {
    if (router.isReady) {
      const request_body = JSON.stringify(DepartmentInfo)
      const res = await request('POST', 'departments', router, request_body, setAlert, 'Tạo phòng ban mới thành công!')
      if (res && res.status === 200) {
        console.log(res.data)
        setDepartmentInfo({
          ...blankDepartment
        })
        setShowDepartmentFormModal(false)
      }
    }
  }

  const handleCreateDepartment = () => {
    setIsCreating(true)
    setShowDepartmentFormModal(true)
  }

  const handleUpdateDepartment = (department_data) => {
    let updatedDepartmentInfo = {...blankDepartment}
    updatedDepartmentInfo.id = department_data.id
    updatedDepartmentInfo.name = department_data.name
    setDepartmentInfo(updatedDepartmentInfo)
    setIsCreating(false)
    setShowDepartmentFormModal(true)
  }

  const updateDepartment = async () => {
    if (router.isReady) {
      const request_body = JSON.stringify(departmentInfo)
      const res = await request('PUT', 'departments', router, request_body, setAlert, 'Cập nhật phòng ban thành công!')
      if (res && res.status === 200) {
        console.log(res.data)
        setDepartmentInfo({
          ...blankDepartment
        })
        setShowDepartmentFormModal(false)
      }
    }
  }

  const handleDeleteDepartment = async (department_id) => {
    if (router.isReady) {
      const res = await request('DELETE', `departments/${department_id}`, router, null, setAlert, 'Xóa phòng ban thành công!')
      if (res && res.status === 200) {
        getDepartments();
      }
    }
  }

  const handleSubmit = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if(isCreating){
      createDepartment()
    } else {
      updateDepartment()
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            Quản lý phòng ban
          </Typography>
          <Typography variant='body2'>
            <Button variant='contained' startIcon={<AddIcon />} onClick={() => handleCreateDepartment()}>
              {' '}
              Thêm phòng ban{' '}
            </Button>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Danh sách phòng ban' titleTypographyProps={{ variant: 'h6' }} />
            <DepartmentsList 
            departmentList={departmentList}
            handleDelete={handleDeleteDepartment}
            handleUpdate={handleUpdateDepartment}
            />
          </Card>
        </Grid>
      </Grid>
      <DepartmentFormModal
        showDepartmentFormModal={showDepartmentFormModal}
        setShowDepartmentFormModal={setShowDepartmentFormModal}
        departmentInfo={departmentInfo}
        setDepartmentInfo={setDepartmentInfo}
        handleSubmit={handleSubmit}
        isCreating={isCreating}
      />
    </>
  )
}

export default DepartmentsManagement

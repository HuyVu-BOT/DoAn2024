import React, { useEffect, useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-tagsinput/react-tagsinput.css'
import { blankDepartment } from "src/models/departments"


export default function DepartmentFormModal(props) {
  const { showDepartmentFormModal, setShowDepartmentFormModal, handleSubmit, setDepartmentInfo, departmentInfo, isCreating } = props
  const inputReference = useRef(null)

  const handleChange = event => {
    const { name, value } = event.target
    setDepartmentInfo(values => {
      return { ...values, [name]: value }
    })
  }
  const handleCancel = () => {
    setShowDepartmentFormModal(false)
    setDepartmentInfo({ ...blankDepartment })
  }

  return (
    <>
      <Modal
        show={showDepartmentFormModal}
        backdrop='static'
        onHide={handleCancel}
        onEntered={() => inputReference.current?.focus()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{isCreating ? 'Tạo phòng ban mới' : 'Cập nhật thông tin phòng ban'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col'>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label>Mã phòng ban</Form.Label>
                  <Form.Control
                    name='id'
                    type='text'
                    readOnly={!isCreating}
                    required
                    placeholder='100909'
                    value={departmentInfo.id || ''}
                    onChange={handleChange}
                    ref={inputReference}
                  />
                </Form.Group>
               
                <Form.Group className='mb-3'>
                  <Form.Label>Tên phòng ban</Form.Label>
                  <Form.Select name='name' value={departmentInfo.name || ''} onChange={handleChange}>
                    <option value=''>Chọn phòng ban</option>
                    <option value='Phòng Hành Chính'>Phòng Hành Chính</option>
                    <option value='Phòng IT'>Phòng IT</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>
            <div className='col-3'></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant='success'
            onClick={handleSubmit}
            disabled={!departmentInfo.id || !departmentInfo.name}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

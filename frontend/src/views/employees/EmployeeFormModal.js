import React, { useEffect, useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-tagsinput/react-tagsinput.css'
import { blankEmployee } from "src/models/employees"
import Image from "next/image";

export default function EmployeeFormModal(props) {
  const { showEmployeeFormModal, setShowEmployeeFormModal, handleSubmit, setEmployeeInfo, employeeInfo, isCreating } = props
  const inputReference = useRef(null)

  const handleChange = event => {
    const { name, value } = event.target
    setEmployeeInfo(values => {
      return { ...values, [name]: value }
    })
  }
  const handleCancel = () => {
    setShowEmployeeFormModal(false)
    setEmployeeInfo({ ...blankEmployee })
  }

  const handleFileSelect = (event) => {
    const reader = new FileReader()

    reader.readAsDataURL(event.target.files[0])

    reader.onload = () => {
      console.log('handleFileSelect: ', reader)
      setEmployeeInfo({...employeeInfo, face_image: reader.result})
    }
  };

  return (
    <>
      <Modal
        show={showEmployeeFormModal}
        backdrop='static'
        onHide={handleCancel}
        onEntered={() => inputReference.current?.focus()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{isCreating ? 'Tạo nhân viên mới' : 'Cập nhật thông tin nhân viên'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col'>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label>Mã nhân viên</Form.Label>
                  <Form.Control
                    name='id'
                    type='text'
                    readOnly={!isCreating}
                    required
                    placeholder='trungvm'
                    value={employeeInfo.id || ''}
                    onChange={handleChange}
                    ref={inputReference}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Tên nhân viên</Form.Label>
                  <Form.Control
                    name='full_name'
                    type='text'
                    required
                    placeholder='Vũ Văn A'
                    value={employeeInfo.full_name || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Tên phòng ban</Form.Label>
                  <Form.Select name='department_id' defaultValue={1} onChange={handleChange}>
                    <option value={1}>Phòng Hành Chính</option>
                    <option value={2}>Phòng IT</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Chọn ảnh nhân viên</Form.Label>
                  <Form.Control type='file' accept='image/*' onChange={handleFileSelect} />
                  {employeeInfo.face_image && <Image width={500} height={500} className='mt-3' src={employeeInfo.face_image} alt='Preview' />}
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
            disabled={!employeeInfo.id || !employeeInfo.department_id || !employeeInfo.face_image}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

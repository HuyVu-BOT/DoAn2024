from fastapi import APIRouter, Depends
from config.db import Session
from schemas.employees import Employees
from schemas.employee_faces import EmployeeFaces
from models.employees import  CreateEmployeeRequest, UpdateEmployeeRequest
from sqlalchemy import select
from config.exception import CustomException
from security.bearer import JWTBearer
from typing import Dict
import cv2
import face_recognition
import base64
import numpy as np

employees = APIRouter()

def base64_str_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

@employees.get("/employees", description="Trả về danh sách nhân viên.")
def get_employees():
    with Session.begin() as session:
        statement = select(Employees) 
        all_employees = session.execute(statement).scalars().all()
        all_employees = [employee.to_dict() for employee in all_employees]
        print("all_employees: ", all_employees)
        return {"status": "OK", "employess": all_employees}
    
    
@employees.post("/employees", description="Thêm người dùng.")
def create_employee(employee: CreateEmployeeRequest, dependency: Dict =Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_id = select(Employees).filter_by(id=employee.id)
        existed_employee_by_id = session.execute(filter_by_id).scalars().all()
        if len(existed_employee_by_id) > 0:
            raise CustomException(status_code=400, detail="Đã có thông tin người dùng này.")
        new_employee = Employees(id=employee.id, full_name=employee.full_name,
                        department_id=employee.department_id,
                        updated_by=dependency["username"])
        session.add(new_employee)
        base64_str = employee.face_image
        img = base64_str_to_cv2_img(base64_str)
        vector = face_recognition.face_encodings(img)[0]
        created_employee = session.execute(select(Employees).filter_by(id=employee.id)).scalars().one()
        new_employee_face = EmployeeFaces(employee_id=created_employee.id,
                                          image=base64_str.encode("ascii"),
                                          vector=vector.tobytes(),
                                          updated_by=dependency["username"])
        session.add(new_employee_face)
        print("created_employee: ", created_employee.to_dict())
        return {"status": "OK", "new_employee": created_employee.to_dict()}
    
@employees.put("/employees", description="Cập nhật thông tin người dùng.")
def update_employee(employee: UpdateEmployeeRequest):
    with Session.begin() as session:
        filter_by_id = select(Employees).filter_by(id=employee.id)
        existed_employee_by_id = session.execute(filter_by_id).scalars().one()
        if not existed_employee_by_id:
            raise CustomException(status_code=400, detail="Chưa có thông tin người dùng này.")
        existed_employee_by_id.full_name=employee.full_name
        existed_employee_by_id.department_id=employee.department_id
        print("updated_employee: ", existed_employee_by_id.to_dict())
        return {"status": "OK", "updated_employee": existed_employee_by_id.to_dict()}
    
@employees.delete("/employees/{id}", description="Xóa một người dùng đã đăng ký.")
def delete_employee(employee_id: str):
    with Session.begin() as session:
        statement = select(Employees).filter_by(id=employee_id)
        existed_employee = session.execute(statement).scalars().one()
        if not existed_employee:
            raise CustomException(status_code=400,
                                detail="Người dùng không tồn tại.")
        statement_employee_faces_by_eid = select(EmployeeFaces).filter_by(employee_id=employee_id)
        employee_faces_by_eids = session.execute(statement_employee_faces_by_eid).scalars().all()
        for employee_face in employee_faces_by_eids:
            session.delete(employee_face)
        session.delete(existed_employee)
        return {"status": "OK"}



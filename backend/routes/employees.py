from fastapi import APIRouter, Depends
from config.db import Session
from schemas.employee_faces import EmployeeFaces
from schemas.employees import Employees
from sqlalchemy import select
from models.employees import CreateEmployeeRequest
from config.exception import CustomException
from security.bearer import JWTBearer
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

@employees.post("/employees", description="Tạo nhân viên.")
def create_employee(employee: CreateEmployeeRequest, dependency =Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_url = select(Employees).filter_by(id=employee.id)
        existed_camera_by_url = session.execute(filter_by_url).scalars().all()
        if len(existed_camera_by_url) > 0:
            raise CustomException(status_code=400, detail="Mã nhân viên này đã được đăng ký.")
        new_employee = Employees(id=employee.id,
                        full_name=employee.full_name,
                        department_id=employee.department_id,
                        updated_by=dependency["username"])
        session.add(new_employee)
        base64_str = employee.face_image
        img = base64_str_to_cv2_img(base64_str)
        vector = face_recognition.face_encodings(img)[0]
        created_employee = session.execute(select(Employees).filter_by(id=employee.id)).scalars().one()
        new_employee_face = EmployeeFaces(employee_id=created_employee.id,
                                        #   image=base64_str.encode("ascii"),
                                          vector=vector.tobytes(),
                                          updated_by=dependency["username"])
        session.add(new_employee_face)
        print("created_employee: ", created_employee.to_dict())
    return {"status": "OK", "new_employee": created_employee.to_dict()}

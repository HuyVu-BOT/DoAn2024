from fastapi import APIRouter, Depends
from config.db import Session
from schemas.employees import Employees
from models.employees import  CreateEmployeeRequest, UpdateEmployeeRequest
from sqlalchemy import select
from config.exception import CustomException
from security.bearer import JWTBearer
from typing import Dict

employees = APIRouter()

@employees.get("/Employees", description="Trả về danh sách nhân viên.")
def get_employees():
    with Session.begin() as session:
        statement = select(Employees) 
        all_employees = session.execute(statement).scalars().all()
        all_employees = [employee.to_dict() for employee in all_employees]
        print("all_employees: ", all_employees)
        return {"status": "OK", "employess": all_employees}
    
    
@employees.post("/Employees", description="Thêm người dùng.")
def create_employee(employee: CreateEmployeeRequest, dependency: Dict =Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_id = select(Employees).filter_by(id=employee.id)
        existed_employee_by_id = session.execute(filter_by_id).scalars().all()
        if len(existed_employee_by_id) > 0:
            raise CustomException(status_code=400, detail="Đã có thông tin người dùng này.")
        new_employee = Employees(full_name=employee.full_name,
                        department_id=employee.department_id,
                        created_by=dependency["username"])
        session.add(new_employee)
        created_employee = session.execute(select(employees).filter_by(id=employee.id)).scalars().one()
        print("created_employee: ", created_employee.to_dict())
        return {"status": "OK", "new_employee": created_employee.to_dict()}
    
@employees.put("/Employees", description="Cập nhật thông tin người dùng.")
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
    
@employees.delete("/Employees/{id}", description="Xóa một người dùng đã đăng ký.")
def delete_employee(employee_id: int):
    with Session.begin() as session:
        statement = select(Employees).filter_by(id=employee_id)
        existed_employee = session.execute(statement).scalars().one()
        if not existed_employee:
            raise CustomException(status_code=400,
                                detail="Người dùng không tồn tại.")
        session.delete(existed_employee)
        return {"status": "OK"}



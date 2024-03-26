from fastapi import APIRouter, Depends
from config.db import Session
from schemas.departments import Departments
from models.departments import CreateDepartmentRequest
from sqlalchemy import select
from config.exception import CustomException
from security.bearer import JWTBearer
from typing import Dict

departments = APIRouter()

@departments.get("/Departments", description="Trả về danh sách phòng ban.")
def get_departments():
    with Session.begin() as session:
        statement = select(Departments) 
        all_departments = session.execute(statement).scalars().all()
        all_departments = [department.to_dict() for department in all_departments]
        print("all_departments: ", all_departments)
        return {"status": "OK", "departments": all_departments}
    

    
@departments.post("/Departments", description="Tạo phòng ban.")
def create_department(department: CreateDepartmentRequest, dependency: Dict =Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_id = select(Departments).filter_by(id=department.id)
        existed_department_by_id = session.execute(filter_by_id).scalars().all()
        if len(existed_department_by_id) > 0:
            raise CustomException(status_code=400, detail="ID phòng ban đã được sử dụng.")
        new_department = Departments(name=department.name)
        session.add(new_department)
        created_department = session.execute(select(departments).filter_by(id = department.id)).scalars().one()
        print("created_department: ", create_department.to_dict())
        return {"status": "OK", "new_department": create_department.to_dict()}

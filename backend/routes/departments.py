from fastapi import APIRouter, Depends
from config.db import Session
from schemas.departments import Departments
from models.departments import CreateDepartmentRequest
from models.departments import UpdateDepartmentRequest
from sqlalchemy import select
from config.exception import CustomException
from security.bearer import JWTBearer
from typing import Dict

departments = APIRouter()

@departments.get("/departments", description="Trả về danh sách phòng ban.")
def get_departments():
    with Session.begin() as session:
        statement = select(Departments) 
        all_departments = session.execute(statement).scalars().all()
        all_departments = [department.to_dict() for department in all_departments]
        print("all_departments: ", all_departments)
        return {"status": "OK", "departments": all_departments}
    
@departments.post("/departments", description="Tạo phòng ban.")
def create_department(department: CreateDepartmentRequest, dependency: Dict =Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_name = select(Departments).filter_by(name=department.name)
        existed_department_by_name = session.execute(filter_by_name).scalars().all()
        if len(existed_department_by_name) > 0:
            raise CustomException(status_code=400, detail="Tên phòng ban đã được đăng ký.")
        new_department = Departments(name=department.name, updated_by=dependency["username"])
        session.add(new_department)
        newly_created_camera = session.execute(select(Departments).filter_by(name = department.name)).scalars().one()
        print("created_department: ", newly_created_camera.to_dict())
        return {"status": "OK", "new_department": newly_created_camera.to_dict()}
    
@departments.delete("/departments/{department_id}", description="Xóa một phòng ban đã đăng ký.")
def delete_department(department_id: int):
    with Session.begin() as session:
        statement = select(Departments).filter_by(id=department_id)
        existed_departments = session.execute(statement).scalars().all()
        if len(existed_departments) == 0:
            raise CustomException(status_code=400,
                                detail="Phòng ban không tồn tại.")
        session.delete(existed_departments[0])
        session.commit()
        return {"status": "OK"}
    
@departments.put("/departments", description="Cập nhật thông tin phòng ban.")
def update_department(department: UpdateDepartmentRequest, dependency: Dict = Depends(JWTBearer())):
    print('a')
    with Session.begin() as session:
        filter_by_id = select(Departments).filter_by(id=department.id)
        existed_departments_by_id = session.execute(filter_by_id).scalars().all()
        if len(existed_departments_by_id) == 0:
            raise CustomException(status_code=400, detail="Chưa có thông tin phòng ban này.")

        # Update a Departments record
        existed_department = existed_departments_by_id[0]
        existed_department.name = department.name
        existed_department.updated_by = dependency["username"]
        session.add(existed_department)

        print("updated_department: ", existed_department.to_dict())
        return {"status": "OK", "updated_department": existed_department.to_dict()}


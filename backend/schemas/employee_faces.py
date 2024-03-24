from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, BLOB
from config.db import BaseDict
from schemas.users import Users
from schemas.employees import Employees

class EmployeeFaces(BaseDict):
    __tablename__ = "employee_faces"
    id = Column(Integer, primary_key=True, autoincrement=True)
    image = Column(BLOB)
    vector = Column(BLOB)
    employee_id = Column(String(60), ForeignKey(Employees.id))
    updated_by = Column(String(45), ForeignKey(Users.username))

    def __repr__(self):
        return f"EmployeeFaces(id={self.id!r}, img_url={self.img_url!r}, employee_id={self.employee_id!r}, updated_by={self.updated_by!r})"
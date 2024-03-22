from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import BaseDict
from schemas.users import Users
from schemas.departments import Departments

class Employees(BaseDict):
    __tablename__ = "employees"
    id = Column(String(60), primary_key=True)
    full_name = Column(String(45))
    department_id = Column(Integer, ForeignKey(Departments.id))
    updated_by = Column(String(45), ForeignKey(Users.username))

    def __repr__(self):
        return f"Employees(id={self.id!r}, full_name={self.full_name!r}, deparment_id={self.department_id!r}, updated_by={self.updated_by!r})"
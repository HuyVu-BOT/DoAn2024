from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import BaseDict
from schemas.users import Users
from schemas.departments import Departments

class Employees(BaseDict):
    __tablename__ = "employees"
    id = Column(String(60), primary_key=True)
    full_name = Column(String(45))
    department = Column(Integer, ForeignKey(Departments.id))
    updated_by = Column(String(45), ForeignKey(Users.username))

    def __repr__(self):
        return f"Cameras(id={self.id!r}, name={self.name!r}, url={self.url!r}, updated_by={self.updated_by!r})"
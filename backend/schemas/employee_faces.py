from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, BLOB
from config.db import BaseDict
from schemas.users import Users
from schemas.employees import Employees

class EmployeeFaces(BaseDict):
    __tablename__ = "employee_faces"
    id = Column(String(60), primary_key=True)
    img_url = Column(String(200))
    vector = Column(BLOB)
    employee_id = Column(Integer, ForeignKey(Employees.id))
    updated_by = Column(String(45), ForeignKey(Users.username))

    def __repr__(self):
        return f"Cameras(id={self.id!r}, name={self.name!r}, url={self.url!r}, updated_by={self.updated_by!r})"
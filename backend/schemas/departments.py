from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import BaseDict
from schemas.users import Users


class Departments(BaseDict):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    updated_by = Column(String(45), ForeignKey(Users.username))

    def __repr__(self):
        return f"Departments(id={self.id!r}, name={self.name!r}, updated_by={self.updated_by!r})"
from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import BaseDict
from schemas.users import Users


class Cameras(BaseDict):
    __tablename__ = "cameras"
    id = Column(Integer, primary_key=True)
    name = Column(String(45))
    url = Column(String(60), unique=True)
    updated_by = Column(String(45), ForeignKey(Users.username))

    def __repr__(self):
        return f"Cameras(id={self.id!r}, name={self.name!r}, url={self.url!r}, updated_by={self.updated_by!r})"
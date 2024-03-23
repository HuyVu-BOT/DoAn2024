from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, DATETIME
from config.db import BaseDict
from schemas.employees import Employees
from schemas.cameras import Cameras

class RecognitionLogs(BaseDict):
    __tablename__ = "recognition_logs"
    id = Column(String(60), primary_key=True)
    employee_id = Column(String(60), ForeignKey(Employees.id))
    camera_id = Column(Integer, ForeignKey(Cameras.id))
    datetime = Column(DATETIME)

    def __repr__(self):
        return f"RecognitionLogs(id={self.id!r}, employee_id={self.employee_id!r}, camera_id={self.camera_id!r}, datetime={self.datetime!r})"
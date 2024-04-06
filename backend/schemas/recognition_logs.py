from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, DATETIME
from config.db import BaseDict
from schemas.employees import Employees

class RecognitionLogs(BaseDict):
    __tablename__ = "recognition_logs"
    id = Column(Integer, primary_key=True)
    employee_id = Column(String(60), ForeignKey(Employees.id))
    camera_name = Column(String(100))
    datetime = Column(DATETIME)

    def __repr__(self):
        return f"RecognitionLogs(id={self.id!r}, employee_id={self.employee_id!r}, camera_id={self.camera_id!r}, datetime={self.datetime!r})"
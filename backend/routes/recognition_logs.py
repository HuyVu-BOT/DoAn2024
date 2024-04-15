from fastapi import APIRouter
from config.db import Session
from schemas.recognition_logs import RecognitionLogs
from sqlalchemy import select
from typing import Dict

recognition_logs = APIRouter()

@recognition_logs.get("/recognition_logs", description="Trả về danh sách log.")
def get_recognition_logs():
    with Session.begin() as session:
        statement = select(RecognitionLogs) 
        all_recognition_logs = session.execute(statement).scalars().all()
        all_recognition_logs = [recognition_log.to_dict() for recognition_log in all_recognition_logs]
        print("all_recognition_logs: ", all_recognition_logs)
        return {"status": "OK", "recognition_logs": all_recognition_logs}
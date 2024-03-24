from fastapi import APIRouter, Depends
from config.db import Session
from sqlalchemy import select
from config.exception import CustomException
from security.bearer import JWTBearer
from typing import Dict
from schemas.cameras import Cameras

fr = APIRouter()

@fr.get("/face_recognition/start", description="Bắt đầu phân tích camera.")
def start(camera_id: int, dependency=Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_id = select(Cameras).filter_by(id=camera_id)
        existed_camera_by_id = session.execute(filter_by_id).scalars().one()
        if not existed_camera_by_id:
            raise CustomException(status_code=400, detail="Camera ID không tồn tại.")
        return {"status": "OK"}


@fr.post("/face_recognition/stop", description="Dừng phân tích camera.")
def stop(camera_id: int):
    with Session.begin() as session:
        filter_by_id = select(Cameras).filter_by(id=camera_id)
        existed_camera_by_id = session.execute(filter_by_id).scalars().one()
        if not existed_camera_by_id:
            raise CustomException(status_code=400, detail="Camera ID không tồn tại.")
        return {"status": "OK"}

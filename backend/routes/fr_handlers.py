from fastapi import APIRouter
from config.db import Session
from sqlalchemy import select
from config.exception import CustomException
from schemas.cameras import Cameras
from config.env import settings
from camera_face_recognition.camera_face_recognition import CameraFaceRecognition

fr_handlers = APIRouter()

@fr_handlers.get("/face_recognition/start", description="Bắt đầu phân tích camera.")
def start(camera_id: int):
    with Session.begin() as session:
        filter_by_id = select(Cameras).filter_by(id=camera_id)
        existed_camera_by_id = session.execute(filter_by_id).scalars().one()
        if not existed_camera_by_id:
            raise CustomException(status_code=400, detail="Camera ID không tồn tại.")
        if len(settings.face_recognition_instances) >= 2:
            raise CustomException(status_code=400, detail="Không thể xử lý nhiều hơn 2 camera cùng lúc.")
        if camera_id in settings.face_recognition_instances:
            raise CustomException(status_code=400, detail="Camera ID này đang được xử lý.")
    new_instance = CameraFaceRecognition(camera_id)
    settings.face_recognition_instances[camera_id] = new_instance
    return {"status": "OK"}


@fr_handlers.get("/face_recognition/stop", description="Dừng phân tích camera.")
def stop(camera_id: int):
    with Session.begin() as session:
        filter_by_id = select(Cameras).filter_by(id=camera_id)
        existed_camera_by_id = session.execute(filter_by_id).scalars().one()
        if not existed_camera_by_id:
            raise CustomException(status_code=400, detail="Camera ID không tồn tại.")
        if camera_id not in settings.face_recognition_instances:
            raise CustomException(status_code=400, detail="Camera ID này chưa được xử lý.")
        settings.face_recognition_instances[camera_id].stop()
        del settings.face_recognition_instances[camera_id]
        return {"status": "OK"}

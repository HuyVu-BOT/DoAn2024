from fastapi import APIRouter, Depends
from config.db import Session
from schemas.cameras import Cameras
from models.cameras import CreateCameraRequest, UpdateCameraRequest
from sqlalchemy import select, update
from config.exception import CustomException
from security.bearer import JWTBearer
from typing import Dict
import cv2

cameras = APIRouter()

@cameras.get("/cameras", description="Trả về danh sách camera.")
def get_cameras():
    with Session.begin() as session:
        statement = select(Cameras) 
        all_cameras = session.execute(statement).scalars().all()
        all_cameras = [camera.to_dict() for camera in all_cameras]
    print("all_cameras: ", all_cameras)
    return {"status": "OK", "cameras": all_cameras}


@cameras.post("/cameras", description="Tạo Camera.")
def create_camera(camera: CreateCameraRequest, dependency: Dict =Depends(JWTBearer())):
    with Session.begin() as session:
        filter_by_url = select(Cameras).filter_by(url=camera.url)
        existed_camera_by_url = session.execute(filter_by_url).scalars().all()
        if len(existed_camera_by_url) > 0:
            raise CustomException(status_code=400, detail="Camera URL đã được đăng ký.")
        url = camera.url
        if camera.url.isnumeric():
            url = int(camera.url)
        video_capture = cv2.VideoCapture(url)
        if not video_capture.isOpened():
            raise CustomException(status_code=400, detail="Camera URL không hợp lệ hoặc không thể mở.")
        video_capture.release()
        new_camera = Cameras(name=camera.name,
                        url=camera.url,
                        updated_by=dependency["username"])
        session.add(new_camera)
        created_camera = session.execute(select(Cameras).filter_by(url=camera.url)).scalars().one()
        created_camera_dict = created_camera.to_dict()
        print("created_camera: ", created_camera_dict)
    return {"status": "OK", "new_camera": created_camera_dict}



@cameras.put("/cameras", description="Cập nhật thông tin camera.")
def update_camera(camera: UpdateCameraRequest):
    with Session.begin() as session:
        filter_by_id = select(Cameras).filter_by(id=camera.id)
        existed_camera_by_id = session.execute(filter_by_id).scalars().all()
        if len(existed_camera_by_id) == 0:
            raise CustomException(status_code=400, detail="Camera không tồn tại.")
        existed_camera_by_id.name=camera.name
        camera_url = camera.url
        if camera.url.isnumeric():
            camera_url = int(camera_url)
        video_capture = cv2.VideoCapture(camera_url)
        if not video_capture.isOpened():
            raise CustomException(status_code=400, detail="Camera URL không hợp lệ hoặc không thể mở.") 
        existed_camera_by_id.url=camera_url
        update(existed_camera_by_id)
        existed_camera_dict = existed_camera_by_id.to_dict()
        print("updated_camera: ", existed_camera_dict)
    return {"status": "OK", "updated_camera": existed_camera_dict}


@cameras.delete("/cameras/{id}", description="Xóa một camera đã đăng ký.")
def delete_camera(camera_id: int):
    with Session.begin() as session:
        statement = select(Cameras).filter_by(id=camera_id)
        existed_camera = session.execute(statement).scalars().all()
        if len(existed_camera) == 0:
            raise CustomException(status_code=400,
                                detail="Camera không tồn tại.")
        session.delete(existed_camera)
    return {"status": "OK"}

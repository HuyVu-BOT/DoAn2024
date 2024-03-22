from fastapi import APIRouter, Depends
from config.db import Session
from schemas.cameras import Cameras
from models.cameras import CreateCameraRequest, UpdateCameraRequest
from sqlalchemy import select
from config.exception import CustomException
from security.bearer import JWTBearer
from security.handler import decode_jwt
from typing import Dict

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
        new_camera = Cameras(name=camera.name,
                        url=camera.url,
                        updated_by=dependency["username"])
        session.add(new_camera)
        created_camera = session.execute(select(Cameras).filter_by(url=camera.url)).scalars().one()
        print("created_camera: ", created_camera.to_dict())
        return {"status": "OK", "new_camera": created_camera.to_dict()}

 

@cameras.put("/cameras", description="Cập nhật thông tin camera.")
def update_camera(camera: UpdateCameraRequest):
    with Session.begin() as session:
        filter_by_id = select(Cameras).filter_by(id=camera.id)
        existed_camera_by_id = session.execute(filter_by_id).scalars().one()
        if not existed_camera_by_id:
            raise CustomException(status_code=400, detail="Camera URL chưa được đăng ký.")
        existed_camera_by_id.name=camera.name
        existed_camera_by_id.url=camera.url
        print("updated_camera: ", existed_camera_by_id.to_dict())
        return {"status": "OK", "updated_camera": existed_camera_by_id.to_dict()}


@cameras.delete("/cameras/{id}", description="Xóa một camera đã đăng ký.")
def delete_camera(camera_id: int):
    with Session.begin() as session:
        statement = select(Cameras).filter_by(id=camera_id)
        existed_camera = session.execute(statement).scalars().one()
        if not existed_camera:
            raise CustomException(status_code=400,
                                detail="Camera không tồn tại.")
        session.delete(existed_camera)
        return {"status": "OK"}

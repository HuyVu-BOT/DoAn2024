from pydantic import BaseModel

class CreateCameraRequest(BaseModel):
    name: str
    url: str

class UpdateCameraRequest(BaseModel):
    id: int
    name: str
    url: str
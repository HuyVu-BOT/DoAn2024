from pydantic import BaseModel

class CreateEmployeeRequest(BaseModel):
    id: str
    full_name: str
    department_id: int
    face_image: str

class UpdateEmployeeRequest(BaseModel):
    id: int
    full_name: str
    department_id: int
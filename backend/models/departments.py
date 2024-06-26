from pydantic import BaseModel

class CreateDepartmentRequest(BaseModel):
    id: int
    name: str

class UpdateDepartmentRequest(BaseModel):
    id: int
    name: str
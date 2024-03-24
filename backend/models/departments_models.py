from pydantic import BaseModel

class CreateDepartmentRequest(BaseModel):
    id: int
    name: str


from pydantic import BaseModel

class CreateEmployeeRequest(BaseModel):
    id: int
    full_name: str
    department_id: int

class UpdateEmployeeRequest(BaseModel):
    id: int
    full_name: str
    department_id: int
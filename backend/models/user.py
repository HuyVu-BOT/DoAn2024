from typing import Optional
from pydantic import BaseModel
from fastapi.security import HTTPBasicCredentials

class SignIn(HTTPBasicCredentials):
    username: str
    password: str

class UserRequest(BaseModel):
    id: Optional[int]
    username: str
    email: str
    password: str
    full_name: str

class UserCount(BaseModel):
    total: int
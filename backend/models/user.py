from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: Optional[int]
    username: str
    email: str
    password: str
    full_name: str

class UserCount(BaseModel):
    total: int
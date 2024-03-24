from pydantic import BaseModel
from fastapi.security import HTTPBasicCredentials

class SignIn(HTTPBasicCredentials):
    username: str
    password: str

class UserRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str

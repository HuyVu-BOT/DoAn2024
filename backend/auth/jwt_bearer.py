from fastapi import Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config.exception import CustomException
from config.env import settings
from .jwt_handler import decode_jwt
import re

def verify_jwt(jwtoken: str):
    isTokenValid: bool = False

    payload = decode_jwt(jwtoken)
    if payload:
        isTokenValid = True
    return isTokenValid, payload


class JWTBearer(HTTPBearer):

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        print("Credentials :", credentials)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise CustomException(status_code=401, detail="Invalid authentication token")
            isTokenValid, payload = verify_jwt(credentials.credentials)
            if not isTokenValid:
                raise CustomException(status_code=401, detail="Invalid token or expired token")
            return payload
        else:
            raise CustomException(status_code=401, detail="Invalid authorization token")

class Authorization():
    def __init__(self):
        pass  

    async def __call__(self, commons: dict = Depends(JWTBearer())):
        user_id = commons['user_id']
        is_admin = re.fullmatch(settings.regex, user_id)
        if not is_admin:
            raise CustomException(status_code=403, detail="Not have permission")
        return True

permission_listener = Authorization()

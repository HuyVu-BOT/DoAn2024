from fastapi import Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config.exception import CustomException
from .handler import decode_jwt
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
                raise CustomException(status_code=401, detail="Token không hợp lệ.")
            isTokenValid, payload = verify_jwt(credentials.credentials)
            if not isTokenValid:
                raise CustomException(status_code=401, detail="Token không hợp lệ hoặc đã quá hạn.")
            return payload
        else:
            raise CustomException(status_code=401, detail="Không có thẩm quyền.")

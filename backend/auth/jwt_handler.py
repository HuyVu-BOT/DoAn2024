import time
import jwt

import traceback
from typing import Dict
from config.env import settings
from config.exception import CustomException


def token_response(token: str):
    return {
        "access_token": token
    }


secret_key = settings.secret_key


def sign_jwt(user_id: str) -> Dict[str, str]:
    # Set the expiry time.
    payload = {
        'user_id': user_id,
        'expires': time.time() + 3600 * 12 * 7
    }
    return token_response(jwt.encode(payload, secret_key, algorithm="HS256"))


def decode_jwt(token: str) -> dict:
    try:
        decoded_token = jwt.decode(
            token.encode(), secret_key, algorithms=["HS256"])
    except Exception as e:
        print(traceback.format_exc())
        raise CustomException(status_code=401, detail="Invalid token.") from e
    return decoded_token if decoded_token['expires'] >= time.time() else {}

"""Custom exception file"""
import traceback
from typing import Any, Dict, Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

class CustomException(HTTPException):
    def __init__(
            self,
            status_code: int = 500,
            detail: Any = None,
            headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(status_code=status_code, detail=detail, headers=headers)

    def get_error_response(self):
        print(traceback.format_exc())
        return JSONResponse(
            status_code=self.status_code,
            content={
                "status": "ERROR",
                "error_message": self.detail,
            },
        )

def catch_exceptions(request: Request, call_next):
    try:
        return call_next(request)
    except:  # pylint: disable=W0702
        print(traceback.format_exc())
        # you probably want some kind of logging here
        return JSONResponse(
            status_code=500,
            content={
                "status": "ERROR",
                "error_message": "Đã có lỗi xảy ra.",
            },
        )

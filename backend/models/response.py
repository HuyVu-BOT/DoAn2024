from pydantic import BaseModel, Field


class SuccessResponse(BaseModel):
    status: str = Field(example="OK")

class ErrorResponse(BaseModel):
    status: str
    error_message: str

    class Config:
        schema_extra = {
            "example": {
                "status": "ERROR",
                "error_message": "Unknown Error.",
            },
        }


class HTTPUnauthorizedError(ErrorResponse):
    class Config:
        schema_extra = {
            "example": {
                "status": "ERROR",
                "error_message": "Unauthorized.",
            },
        }


class HTTPNotFoundError(ErrorResponse):
    class Config:
        schema_extra = {
            "example": {
                "status": "ERROR",
                "error_message": "Not Found.",
            },
        }


class HTTPBadRequestError(ErrorResponse):
    class Config:
        schema_extra = {
            "example": {
                "status": "ERROR",
                "error_message": "Request parameter invalid.",
            },
        }


def make_500_response(error_code, error_message):
    return {
        "model": ErrorResponse,
        "description": "Internal Server Error",
        "content": {
            "application/json": {
                "example": {
                    "status": "ERROR",
                    "error_message": error_message,
                }
            }
        },
    }

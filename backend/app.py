from fastapi import FastAPI, Depends, Request
import uvicorn
from routes.user import user
from config.openapi import tags_metadata
from auth.jwt_bearer import JWTBearer
from fastapi.middleware.cors import CORSMiddleware
from config.exception import CustomException, catch_exceptions

app = FastAPI(
    title="Graduation Project",
    description="Backend for the graduation project.",
    version="0.0.1",
    openapi_tags=tags_metadata,
)

token_listener = JWTBearer()

@app.exception_handler(CustomException)
async def api_exception_handler(request: Request, exc: CustomException):
    print("Request error: %s, %s", request.url, exc)
    return exc.get_error_response()

app.middleware("http")(catch_exceptions)

origins = [
"localhost",
"localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user)
# app.include_router(user, dependencies=[Depends(token_listener)])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8088, log_level='debug')
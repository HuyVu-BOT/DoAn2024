from fastapi import FastAPI, Request, Depends
import uvicorn
from routes.users import users
from routes.employees import employees
from routes.departments import departments
from routes.recognition_logs import recognition_logs
from config.openapi import tags_metadata
from security.bearer import JWTBearer
from fastapi.middleware.cors import CORSMiddleware
from config.exception import CustomException, catch_exceptions
from fastapi.openapi.utils import get_openapi
from config.db import Base, engine

app = FastAPI(
    title="Ứng dụng quản lý ra vào.",
    description="Backend cho ứng dụng quản lý ra vào.",
    version="0.0.1",
    openapi_tags=tags_metadata,
)

token_listener = JWTBearer()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(engine)

@app.exception_handler(CustomException)
async def api_exception_handler(request: Request, exc: CustomException):
    print("Request error: %s, %s", request.url, exc)
    return exc.get_error_response()

app.middleware("http")(catch_exceptions)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def custom_openapi():
    """
    custom api schema for keeping our schema
    :return:
    """
    if not app.openapi_schema:
        app.openapi_schema = get_openapi(
            title=app.title,
            version=app.version,
            # openapi_version=app.openapi_version,
            description=app.description,
            # terms_of_service=app.terms_of_service,
            # contact=app.contact,
            # license_info=app.license_info,
            routes=app.routes,
            tags=app.openapi_tags,
            servers=app.servers,
        )

    return app.openapi_schema


app.openapi = custom_openapi

app.include_router(users, tags=["Users"])
app.include_router(employees, tags=["Employees"], dependencies=[Depends(token_listener)])
app.include_router(departments, tags=["Departments"], dependencies=[Depends(token_listener)])
app.include_router(recognition_logs, tags=["recognition_logs"], dependencies=[Depends(token_listener)])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8088, log_level='debug')
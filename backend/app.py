from fastapi import FastAPI, Depends, Request
import uvicorn
from routes.user import user
from config.openapi import tags_metadata
from auth.jwt_bearer import JWTBearer
from fastapi.middleware.cors import CORSMiddleware
from config.exception import CustomException, catch_exceptions
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="Ứng dụng chấm công.",
    description="Backend cho ứng dụng chấm công.",
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
        # for _, method_item in app.openapi_schema.get("paths").items():
        #     for _, param in method_item.items():
        #         responses = param.get("responses")
        #         # remove 422 response, also can remove other status code
        #         if "422" in responses:
        #             del responses["422"]

    return app.openapi_schema


app.openapi = custom_openapi

app.include_router(user)
# app.include_router(user, dependencies=[Depends(token_listener)])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8088, log_level='debug')
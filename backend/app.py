from fastapi import FastAPI
import uvicorn
from routes.user import user
from config.openapi import tags_metadata

app = FastAPI(
    title="Users API",
    description="a REST API using python and mysql",
    version="0.0.1",
    openapi_tags=tags_metadata,
)

app.include_router(user)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8088, log_level='debug')
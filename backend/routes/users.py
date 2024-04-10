from fastapi import APIRouter
from config.db import Session
from schemas.users import Users
from models.users import UserRequest, SignIn
from sqlalchemy import select
from config.exception import CustomException
from security.handler import sign_jwt
from passlib.context import CryptContext

users = APIRouter()
hash_provider = CryptContext(schemes=["bcrypt"])

@users.post("/login", description="Đăng nhập.")
def user_login(login_info: SignIn):
    with Session.begin() as session:
        statement = select(Users).filter_by(username=login_info.username)
        existed_users_by_username = session.execute(statement).scalars().all()
        if len(existed_users_by_username) > 0:
            if hash_provider.verify(login_info.password, existed_users_by_username[0].password):
                return sign_jwt(existed_users_by_username[0].username)

            raise CustomException(
                status_code=401,
                detail="Sai tên đăng nhập hoặc mật khẩu."
            )

        raise CustomException(
            status_code=401,
            detail="Sai tên đăng nhập hoặc mật khẩu."
        )

# @user.get(
#     "/users",
#     tags=["users"],
#     response_model=List[User],
#     description="Get a list of all users",
# )
# def get_users():
#     return conn.execute(users.select()).fetchall()


# @user.get("/users/count", tags=["users"], response_model=UserCount)
# def get_users_count():
#     result = conn.execute(select([func.count()]).select_from(users))
#     return {"total": tuple(result)[0][0]}


# @user.get(
#     "/users/{id}",
#     tags=["users"],
#     response_model=User,
#     description="Get a single user by Id",
# )
# def get_user(id: str):
#     return conn.execute(users.select().where(users.c.id == id)).first()


@users.post("/users", description="Tạo người dùng.")
def create_user(user: UserRequest):
    with Session.begin() as session:
        statement1 = select(Users).filter_by(username=user.username)
        statement2 = select(Users).filter_by(email=user.email)
        existed_user_by_username = session.execute(statement1).scalars().all()
        existed_user_by_email = session.execute(statement2).scalars().all()
        if len(existed_user_by_username) > 0 or len(existed_user_by_email) > 0:
            raise CustomException(status_code=400, detail="Username hoặc email đã được đăng ký.")
        new_user = Users(username=user.username,
                        email=user.email,
                        full_name=user.full_name,
                        password=hash_provider.encrypt(user.password))
        session.add(new_user)
        return {"status": "OK"}



# @user.put(
#     "users/{id}", tags=["users"], response_model=User, description="Update a User by Id"
# )
# def update_user(user: User, id: int):
#     conn.execute(
#         users.update()
#         .values(username=user.username, email=user.email, password=user.password, full_name=user.full_name)
#         .where(users.c.id == id)
#     )
#     updated_user = conn.execute(users.select().where(users.c.id == id)).first()
#     return {
#         "status": "OK",
#         "updated_user": updated_user
#     }


@users.delete("/users/{username}", description="Xóa một người dùng.")
def delete_user(username: int):
    with Session.begin() as session:
        statement = select(Users).filter_by(username=username)
        existed_users = session.execute(statement).scalars().all()
        if len(existed_users) == 0:
            raise CustomException(status_code=400,
                                detail="Người dùng không tồn tại.")
        session.delete(existed_users[0])
        session.commit()
        return {"status": "OK"}

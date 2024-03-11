from fastapi import APIRouter
from config.db import Session
from schemas.user import User
from models.user import UserRequest, UserCount, SignIn
from sqlalchemy import select
from config.exception import CustomException
from auth.jwt_handler import sign_jwt
from passlib.context import CryptContext

user = APIRouter()
hash_provider = CryptContext(schemes=["bcrypt"])

@user.post("/login")
def user_login(login_info: SignIn):
    with Session.begin() as session:
        statement = select(User).filter_by(username=login_info.username)
        existed_users_by_username = session.execute(statement).scalars().all()
        if len(existed_users_by_username) > 0:
            if hash_provider.verify(login_info.password, existed_users_by_username[0].password):
                return {"status": "OK", **sign_jwt(login_info.username)}

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


@user.post("/", tags=["users"], description="Create a new user")
def create_user(user: UserRequest):
    with Session.begin() as session:
        statement1 = select(User).filter_by(username=user.username)
        statement2 = select(User).filter_by(email=user.email)
        existed_user_by_username = session.execute(statement1).scalars().all()
        existed_user_by_email = session.execute(statement2).scalars().all()
        if len(existed_user_by_username) > 0 or len(existed_user_by_email) > 0:
            raise CustomException(status_code=400, detail="Username hoặc email đã được đăng ký.")
        new_user = User(username=user.username,
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


@user.delete("/{id}", tags=["users"])
def delete_user(id: int):
    with Session.begin() as session:
        statement = select(User).filter_by(id=id)
        existed_users = session.execute(statement).scalars().all()
        if len(existed_users) == 0:
            raise CustomException(status_code=400,
                                detail="Người dùng không tồn tại.")
        session.delete(existed_users[0])
        return {"status": "OK"}

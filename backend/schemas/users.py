from sqlalchemy import Column
from sqlalchemy.sql.sqltypes import String
from config.db import Base


class Users(Base):
    __tablename__ = "users"
    username = Column(String(45), primary_key=True)
    email = Column(String(60))
    password = Column(String(255))
    full_name = Column(String(45))

    def __repr__(self):
        return f"Users(username={self.username!r}, full_name={self.full_name!r})"
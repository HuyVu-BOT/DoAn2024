from sqlalchemy import Column
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(45))
    email = Column(String(60))
    password = Column(String(255))
    full_name = Column(String(45))

    def __repr__(self):
        return f"Users(id={self.id!r}, username={self.username!r}, full_name={self.full_name!r})"
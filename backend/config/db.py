from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from config.env import settings
from sqlalchemy.orm import sessionmaker

engine = create_engine(settings.DB_URL)
Session = sessionmaker("mysql+pymysql://root:abc%40123@localhost:3306/graduation_project")

Base = declarative_base()


class BaseDict(Base):
    __abstract__ = True

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}



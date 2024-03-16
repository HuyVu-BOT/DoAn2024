from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from config.env import settings
from sqlalchemy.orm import sessionmaker

engine = create_engine(settings.DB_URL)
Session = sessionmaker(engine, future=True)

Base = declarative_base()

Base.metadata.create_all(engine)

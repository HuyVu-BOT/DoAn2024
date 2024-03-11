from sqlalchemy import create_engine, MetaData

engine = create_engine("mysql+pymysql://root:abc%40123@localhost:3306/graduation_project")

meta = MetaData()

conn = engine.connect()
from sqlalchemy import Column, Table
from sqlalchemy.sql.sqltypes import Integer, String
from config.db import meta, engine

users = Table(
    "users",
    meta,
    Column("id", Integer, primary_key=True),
    Column("username", String(45)),
    Column("email", String(60)),
    Column("password", String(255)),
    Column("full_name", String(45)),
)

meta.create_all(engine)

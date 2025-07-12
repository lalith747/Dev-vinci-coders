# models/tag.py
from sqlalchemy import Column, Integer, String
from .base import Base

class Tag(Base):
    __tablename__ = 'Tags'

    tag_id = Column(Integer, primary_key=True, autoincrement=True)
    tag_name = Column(String(50), unique=True, nullable=False)

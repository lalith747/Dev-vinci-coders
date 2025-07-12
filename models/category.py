# models/category.py
from sqlalchemy import Column, Integer, String
from .base import Base

class Category(Base):
    __tablename__ = 'Categories'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(50), unique=True, nullable=False)

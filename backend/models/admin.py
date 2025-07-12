# models/admin.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .base import Base

class Admin(Base):
    __tablename__ = 'Admins'

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(50), default='moderator')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

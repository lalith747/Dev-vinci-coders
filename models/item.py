# models/item.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from .base import Base

class Item(Base):
    __tablename__ = 'Items'

    item_id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey('Users.user_id'), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)
    type = Column(String(50))
    size = Column(String(20))
    condition = Column(String(50), nullable=False)
    point_value = Column(Integer, nullable=False)
    status = Column(String(20), default='pending_approval', nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

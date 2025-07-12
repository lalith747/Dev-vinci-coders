# models/item_image.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from .base import Base

class ItemImage(Base):
    __tablename__ = 'ItemImages'

    image_id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey('Items.item_id', ondelete='CASCADE'), nullable=False)
    image_url = Column(String(255), nullable=False)
    is_thumbnail = Column(Boolean, default=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

# models/swap_request.py
from sqlalchemy import Column, Integer, Text, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from .base import Base

class SwapRequest(Base):
    __tablename__ = 'SwapRequests'

    swap_request_id = Column(Integer, primary_key=True, autoincrement=True)
    requester_id = Column(Integer, ForeignKey('Users.user_id'), nullable=False)
    requested_item_id = Column(Integer, ForeignKey('Items.item_id'), nullable=False)
    offered_item_id = Column(Integer, ForeignKey('Items.item_id'))
    request_message = Column(Text)
    status = Column(String(20), default='pending', nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# models/point_transaction.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from .base import Base

class PointTransaction(Base):
    __tablename__ = 'PointTransactions'

    transaction_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('Users.user_id'), nullable=False)
    item_id = Column(Integer, ForeignKey('Items.item_id'))
    points_amount = Column(Integer, nullable=False)
    transaction_type = Column(String(50), nullable=False)
    description = Column(Text)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())

# models/item_tag.py
from sqlalchemy import Column, Integer, ForeignKey
from .base import Base

class ItemTag(Base):
    __tablename__ = 'ItemTags'

    item_id = Column(Integer, ForeignKey('Items.item_id', ondelete='CASCADE'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('Tags.tag_id', ondelete='CASCADE'), primary_key=True)

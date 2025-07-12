# create_all.py
from .base import Base, engine
from . import user, item, item_image, category, tag, item_tag, swap_request, point_transaction, admin

Base.metadata.create_all(bind=engine)

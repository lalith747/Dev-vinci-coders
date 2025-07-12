from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import SessionLocal
from schemas.item import ItemCreate
from utils.deps import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=201)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    return {"message": "Item created (mock)", "user_id": user_id}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import RegisterRequest, LoginRequest
from utils.hash import hash_password, verify_password
from utils.token import create_token
from db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    return {"message": "User registered (mock)"}

@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):
    return {"access_token": create_token({"sub": "1"})}

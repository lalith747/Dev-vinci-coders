from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas.user import RegisterRequest, LoginRequest, UserResponse
from ..utils.hash import hash_password, verify_password
from ..utils.token import create_token
from ..db import SessionLocal
from ..models.user import User as UserModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: RegisterRequest):
    # Mocked user response
    return UserResponse(
        id=1,
        username=user.username,
        email=user.email,
        points=50,
        is_admin=False,
        location=getattr(user, 'location', 'mock-location')
    )

@router.post("/login")
def login(user: LoginRequest):
    # Mocked login always succeeds
    fake_token = "mocked.jwt.token"
    return {
        "access_token": fake_token,
        "token_type": "bearer",
        "user": {
            "id": 1,
            "username": user.username if hasattr(user, 'username') else "mockuser",
            "email": user.email,
            "points": 50,
            "is_admin": False,
            "location": getattr(user, 'location', 'mock-location')
        }
    }

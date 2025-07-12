from datetime import datetime
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    points: int
    location: str | None = None
    avatar: str | None = None
    is_admin: bool
    created_at: str

    class Config:
        orm_mode = True

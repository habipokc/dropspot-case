import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: uuid.UUID
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class DropBase(BaseModel):
    name: str
    description: str | None = None
    claim_window_start: datetime
    claim_window_end: datetime
    total_stock: int


class DropCreate(DropBase):
    pass


class Drop(DropBase):
    id: uuid.UUID
    claimed_stock: int
    created_at: datetime

    class Config:
        from_attributes = True

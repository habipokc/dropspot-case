import uuid

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Drop(Base):
    __tablename__ = "drops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    claim_window_start = Column(DateTime(timezone=True), nullable=False)
    claim_window_end = Column(DateTime(timezone=True), nullable=False)
    total_stock = Column(Integer, nullable=False)
    claimed_stock = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    drop_id = Column(UUID(as_uuid=True), ForeignKey("drops.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    priority_score = Column(Integer, default=0)

    __table_args__ = (UniqueConstraint("user_id", "drop_id", name="_user_drop_uc"),)


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    drop_id = Column(UUID(as_uuid=True), ForeignKey("drops.id"), nullable=False)
    claim_code = Column(String, unique=True, index=True, nullable=False)
    claimed_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "drop_id", name="_user_drop_claim_uc"),
    )

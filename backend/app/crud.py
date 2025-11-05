import secrets
import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from . import config, models, schemas, security


# --- User Functions ---
def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    return db_user


# --- Drop Functions ---
def get_drop(db: Session, drop_id: uuid.UUID):
    return db.query(models.Drop).filter(models.Drop.id == drop_id).first()


def get_drops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Drop).offset(skip).limit(limit).all()


def create_drop(db: Session, drop: schemas.DropCreate):
    db_drop = models.Drop(**drop.model_dump())
    db.add(db_drop)
    return db_drop


def update_drop(db: Session, db_drop: models.Drop, drop_update: schemas.DropCreate):
    update_data = drop_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_drop, key, value)
    db.add(db_drop)
    return db_drop


def delete_drop(db: Session, db_drop: models.Drop):
    db.delete(db_drop)
    return db_drop


# --- Waitlist Functions ---
def join_waitlist(db: Session, user: models.User, drop_id: uuid.UUID):
    user_created_at = user.created_at
    if user_created_at.tzinfo is None:
        user_created_at = user_created_at.replace(tzinfo=timezone.utc)

    account_age_days = (datetime.now(timezone.utc) - user_created_at).days
    joined_at_second = datetime.now(timezone.utc).second
    priority_score = (account_age_days % config.B) * 10 - (joined_at_second % config.A)

    db_waitlist_entry = models.WaitlistEntry(
        user_id=user.id, drop_id=drop_id, priority_score=priority_score
    )
    db.add(db_waitlist_entry)
    return db_waitlist_entry


def leave_waitlist(db: Session, waitlist_entry: models.WaitlistEntry):
    db.delete(waitlist_entry)
    return waitlist_entry


def get_waitlist_entry(db: Session, user_id: uuid.UUID, drop_id: uuid.UUID):
    return (
        db.query(models.WaitlistEntry)
        .filter(
            models.WaitlistEntry.user_id == user_id,
            models.WaitlistEntry.drop_id == drop_id,
        )
        .first()
    )


# --- Claim Functions ---
def create_claim(db: Session, user_id: uuid.UUID, drop: models.Drop):
    claim_code = f"CLAIM-{drop.id.hex[:4]}-{secrets.token_hex(4).upper()}"
    db_claim = models.Claim(user_id=user_id, drop_id=drop.id, claim_code=claim_code)
    db.add(db_claim)
    drop.claimed_stock += 1
    return db_claim

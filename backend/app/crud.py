import uuid

from sqlalchemy.orm import Session

from . import models, schemas, security


def get_user_by_email(db: Session, email: str):
    """E-posta adresine göre bir kullanıcıyı veritabanından bulur."""
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    """Yeni bir kullanıcı oluşturur ve veritabanına kaydeder."""
    hashed_password = security.get_password_hash(user.password)

    db_user = models.User(email=user.email, hashed_password=hashed_password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_drop(db: Session, drop_id: uuid.UUID):
    """ID'ye göre tek bir Drop'u getirir."""
    return db.query(models.Drop).filter(models.Drop.id == drop_id).first()


def get_drops(db: Session, skip: int = 0, limit: int = 100):
    """Tüm Drop'ları listeler (sayfalama ile)."""
    return db.query(models.Drop).offset(skip).limit(limit).all()


def create_drop(db: Session, drop: schemas.DropCreate):
    """Yeni bir Drop oluşturur."""
    db_drop = models.Drop(**drop.model_dump())
    db.add(db_drop)
    db.commit()
    db.refresh(db_drop)
    return db_drop


def update_drop(db: Session, drop_id: uuid.UUID, drop_update: schemas.DropCreate):
    """Mevcut bir Drop'u günceller."""
    db_drop = get_drop(db, drop_id)
    if db_drop:
        update_data = drop_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_drop, key, value)
        db.commit()
        db.refresh(db_drop)
    return db_drop


def delete_drop(db: Session, drop_id: uuid.UUID):
    """Bir Drop'u siler."""
    db_drop = get_drop(db, drop_id)
    if db_drop:
        db.delete(db_drop)
        db.commit()
    return db_drop

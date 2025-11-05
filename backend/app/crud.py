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

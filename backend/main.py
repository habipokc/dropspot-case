from app import crud, models, schemas
from app.database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/auth/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Yeni bir kullanıcı oluşturur.
    - E-posta zaten kayıtlıysa hata verir.
    - Başarılı olursa oluşturulan kullanıcıyı döner.
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_user(db=db, user=user)

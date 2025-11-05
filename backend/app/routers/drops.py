import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import ai_services, crud, models, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/admin/drops",
    tags=["Admin Drops"],
    dependencies=[Depends(security.get_current_admin_user)],
)


@router.post("/", response_model=schemas.Drop)
def create_new_drop(drop: schemas.DropCreate, db: Session = Depends(get_db)):
    new_drop = crud.create_drop(db=db, drop=drop)
    db.commit()
    db.refresh(new_drop)
    return new_drop


@router.get("/", response_model=List[schemas.Drop])
def read_all_drops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_drops(db, skip=skip, limit=limit)


@router.put("/{drop_id}", response_model=schemas.Drop)
def update_existing_drop(
    drop_id: uuid.UUID, drop: schemas.DropCreate, db: Session = Depends(get_db)
):
    db_drop = crud.get_drop(db, drop_id=drop_id)
    if db_drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")

    updated_drop = crud.update_drop(db, db_drop=db_drop, drop_update=drop)
    db.commit()
    db.refresh(updated_drop)
    return updated_drop


@router.delete("/{drop_id}", response_model=schemas.Drop)
def delete_existing_drop(drop_id: uuid.UUID, db: Session = Depends(get_db)):
    db_drop = crud.get_drop(db, drop_id=drop_id)
    if db_drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")

    crud.delete_drop(db, db_drop=db_drop)
    db.commit()
    return db_drop


@router.post("/generate-description", response_model=dict)
def generate_description_with_ai(request_body: schemas.AIGenerationRequest):
    """
    Verilen drop adı ve anahtar kelimelerle AI kullanarak bir açıklama üretir.
    """
    description = ai_services.generate_drop_description(
        name=request_body.name, keywords=request_body.keywords
    )
    return {"description": description}


@router.put("/{drop_id}", response_model=schemas.Drop)
def update_existing_drop(
    drop_id: uuid.UUID,
    drop_update: schemas.DropCreate,  # Yeni veriyi bu şema ile alacağız
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(security.get_current_admin_user),
):
    db_drop = crud.get_drop(db, drop_id=drop_id)
    if db_drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")

    updated_drop = crud.update_drop(db=db, db_drop=db_drop, drop_update=drop_update)

    db.commit()
    db.refresh(updated_drop)

    return updated_drop

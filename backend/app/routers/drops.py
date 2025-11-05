import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/admin/drops",
    tags=["Admin Drops"],
    dependencies=[Depends(security.get_current_admin_user)],
)


@router.post("/", response_model=schemas.Drop)
def create_new_drop(drop: schemas.DropCreate, db: Session = Depends(get_db)):
    return crud.create_drop(db=db, drop=drop)


@router.get("/", response_model=List[schemas.Drop])
def read_all_drops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    drops = crud.get_drops(db, skip=skip, limit=limit)
    return drops


@router.put("/{drop_id}", response_model=schemas.Drop)
def update_existing_drop(
    drop_id: uuid.UUID, drop: schemas.DropCreate, db: Session = Depends(get_db)
):
    db_drop = crud.update_drop(db, drop_id=drop_id, drop_update=drop)
    if db_drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")
    return db_drop


@router.delete("/{drop_id}", response_model=schemas.Drop)
def delete_existing_drop(drop_id: uuid.UUID, db: Session = Depends(get_db)):
    db_drop = crud.delete_drop(db, drop_id=drop_id)
    if db_drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")
    return db_drop

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/drops",
    tags=["Drops"],
)


@router.get("/", response_model=List[schemas.Drop])
def get_all_active_drops(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Tüm aktif drop'ları listeler."""
    drops = crud.get_drops(db, skip=skip, limit=limit)
    return drops


@router.post("/{drop_id}/join", response_model=schemas.WaitlistEntry)
def join_drop_waitlist(
    drop_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Geçerli kullanıcıyı belirtilen drop'un bekleme listesine ekler."""
    db_drop = crud.get_drop(db, drop_id=drop_id)
    if not db_drop:
        raise HTTPException(status_code=404, detail="Drop not found")

    entry = crud.join_waitlist(db=db, user_id=current_user.id, drop_id=drop_id)
    if entry is None:
        raise HTTPException(status_code=400, detail="User already in waitlist")

    return entry


@router.post("/{drop_id}/leave", status_code=status.HTTP_204_NO_CONTENT)
def leave_drop_waitlist(
    drop_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Geçerli kullanıcıyı belirtilen drop'un bekleme listesinden çıkarır."""
    entry = crud.leave_waitlist(db=db, user_id=current_user.id, drop_id=drop_id)
    if entry is None:
        raise HTTPException(
            status_code=404, detail="User not in waitlist for this drop"
        )

    return None


@router.post("/{drop_id}/claim", response_model=schemas.Claim)
def claim_drop(
    drop_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """
    Geçerli kullanıcının belirtilen drop için hak talebinde bulunmasını sağlar.
    Bu işlem, veri bütünlüğünü sağlamak için bir transaction ve locking kullanır.
    """
    with db.begin_nested():  # Bu, otomatik bir transaction başlatır. Hata olursa rollback yapar.
        # Satırı kilitleyerek race condition'ı önle (SELECT ... FOR UPDATE)
        drop_to_claim = (
            db.query(models.Drop)
            .filter(models.Drop.id == drop_id)
            .with_for_update()
            .first()
        )

        if not drop_to_claim:
            raise HTTPException(status_code=404, detail="Drop not found")

        # Zaman kontrolü - datetime'ları timezone-aware yap
        now = datetime.now(timezone.utc)

        # claim_window_start'ı timezone-aware yap
        claim_start = drop_to_claim.claim_window_start
        if claim_start.tzinfo is None:
            claim_start = claim_start.replace(tzinfo=timezone.utc)

        # claim_window_end'i timezone-aware yap
        claim_end = drop_to_claim.claim_window_end
        if claim_end.tzinfo is None:
            claim_end = claim_end.replace(tzinfo=timezone.utc)

        # Şimdi güvenle karşılaştır
        if not (claim_start <= now <= claim_end):
            raise HTTPException(status_code=400, detail="Claim window is not open")

        # Stok kontrolü
        if drop_to_claim.claimed_stock >= drop_to_claim.total_stock:
            raise HTTPException(status_code=400, detail="No stock left")

        # TODO: Kazananları belirleme mantığı eklenecek. Şimdilik listede olmak yeterli.
        waitlist_entry = crud.get_waitlist_entry(
            db, user_id=current_user.id, drop_id=drop_id
        )
        if not waitlist_entry:
            raise HTTPException(status_code=400, detail="User is not on the waitlist")

        # Kullanıcının zaten claim yapıp yapmadığını kontrol et
        existing_claim = (
            db.query(models.Claim)
            .filter(
                models.Claim.user_id == current_user.id, models.Claim.drop_id == drop_id
            )
            .first()
        )
        if existing_claim:
            raise HTTPException(
                status_code=400, detail="User has already claimed this drop"
            )

        new_claim = crud.create_claim(
            db=db, user_id=current_user.id, drop=drop_to_claim
        )
        db.flush()
        return new_claim

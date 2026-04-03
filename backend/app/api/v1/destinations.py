from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.destination import Destination
from app.models.user import User
from app.schemas.destination import DestinationCreate, DestinationRead

router = APIRouter()


@router.get("", response_model=list[DestinationRead])
def list_destinations(db: Session = Depends(get_db)):
    """Public — list all featured destinations."""
    return db.query(Destination).order_by(Destination.id).all()


@router.get("/{slug}", response_model=DestinationRead)
def get_destination(slug: str, db: Session = Depends(get_db)):
    """Public — get a destination by slug."""
    dest = db.query(Destination).filter(Destination.slug == slug).first()
    if not dest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    return dest


@router.post("", response_model=DestinationRead, status_code=status.HTTP_201_CREATED)
def create_destination(
    payload: DestinationCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — create a destination."""
    from datetime import datetime
    existing = db.query(Destination).filter(Destination.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Destination with this slug already exists")
    dest = Destination(**payload.model_dump(), created_at=str(datetime.utcnow()))
    db.add(dest)
    db.commit()
    db.refresh(dest)
    return dest


@router.put("/{slug}", response_model=DestinationRead)
def update_destination(
    slug: str,
    payload: DestinationCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — update a destination."""
    dest = db.query(Destination).filter(Destination.slug == slug).first()
    if not dest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(dest, field, value)
    db.commit()
    db.refresh(dest)
    return dest


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_destination(
    slug: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — delete a destination (packages become unlinked, not deleted)."""
    dest = db.query(Destination).filter(Destination.slug == slug).first()
    if not dest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    db.delete(dest)
    db.commit()

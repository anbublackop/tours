from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.security import require_admin
from app.db.session import get_db
from app.models.package import Package
from app.models.user import User
from app.schemas.package import PackageCreate, PackageListRead, PackageRead, PackageUpdate

router = APIRouter()


@router.get("", response_model=list[PackageListRead])
def list_packages(
    country: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Public — browse packages with optional filters."""
    q = db.query(Package)
    if country:
        q = q.filter(Package.country == country)
    if category:
        q = q.filter(Package.category == category)
    if limit:
        q = q.limit(limit)
    return q.all()


@router.get("/{package_id}", response_model=PackageRead)
def get_package(package_id: int, db: Session = Depends(get_db)):
    """Public — full package detail."""
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    return pkg


@router.post("", response_model=PackageRead, status_code=status.HTTP_201_CREATED)
def create_package(
    payload: PackageCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — create a new tour package."""
    now = str(datetime.utcnow())
    pkg = Package(**payload.model_dump(), name=payload.title, created_at=now, updated_at=now)
    db.add(pkg)
    db.commit()
    db.refresh(pkg)
    return pkg


@router.put("/{package_id}", response_model=PackageRead)
def update_package(
    package_id: int,
    payload: PackageUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — update a package."""
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(pkg, field, value)
    if payload.title:
        pkg.name = payload.title
    pkg.updated_at = str(datetime.utcnow())
    db.commit()
    db.refresh(pkg)
    return pkg


@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_package(
    package_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — delete a package."""
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    db.delete(pkg)
    db.commit()

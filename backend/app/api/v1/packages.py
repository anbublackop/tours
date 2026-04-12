from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from app.core.security import require_admin
from app.db.session import get_db
from app.models.destination import Destination
from app.models.package import Package
from app.models.package_category import PackageCategory
from app.models.user import User
from app.schemas.package import PackageCreate, PackageListRead, PackageRead, PackageUpdate

router = APIRouter()


@router.get("", response_model=list[PackageListRead])
def list_packages(
    search: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    destination_slug: Optional[str] = Query(None),
    destination_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    category_slug: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    limit: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Public — browse packages with optional filters.

    Priority for location filter:  destination_id > destination_slug > country.
    Priority for category filter:  category_id > category_slug > category.
    """
    qs = db.query(Package).filter(Package.is_active == 1)

    # ── Full-text search ──────────────────────────────────────────────────────
    if search:
        term = f"%{search}%"
        qs = qs.filter(
            or_(
                Package.title.ilike(term),
                Package.description.ilike(term),
                Package.location.ilike(term),
                Package.state.ilike(term),
                Package.country.ilike(term),
                Package.category.ilike(term),
            )
        )

    # ── Destination filter ────────────────────────────────────────────────────
    if destination_id:
        qs = qs.filter(Package.destination_id == destination_id)
    elif destination_slug:
        dest = db.query(Destination).filter(Destination.slug == destination_slug).first()
        if dest:
            qs = qs.filter(Package.destination_id == dest.id)
        else:
            qs = qs.filter(Package.country == destination_slug)
    elif country:
        qs = qs.filter(Package.country == country)

    # ── Category filter ───────────────────────────────────────────────────────
    if category_id:
        qs = qs.filter(Package.category_id == category_id)
    elif category_slug:
        cat = db.query(PackageCategory).filter(PackageCategory.slug == category_slug).first()
        if cat:
            qs = qs.filter(Package.category_id == cat.id)
        else:
            qs = qs.filter(Package.category == category_slug)
    elif category:
        qs = qs.filter(Package.category == category)

    if limit:
        qs = qs.limit(limit)
    return qs.all()


@router.get("/all", response_model=list[PackageListRead])
def list_all_packages_route(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — list ALL packages including archived."""
    return db.query(Package).order_by(Package.id.desc()).all()


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


@router.patch("/{package_id}/archive", response_model=PackageListRead)
def toggle_archive(
    package_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — toggle a package's active/archived state."""
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    pkg.is_active = 0 if pkg.is_active else 1
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
    """Admin only — permanently delete a package."""
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    db.delete(pkg)
    db.commit()

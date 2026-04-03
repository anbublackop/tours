from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.package_category import PackageCategory
from app.models.user import User
from app.schemas.package_category import PackageCategoryCreate, PackageCategoryRead

router = APIRouter()


@router.get("", response_model=list[PackageCategoryRead])
def list_categories(db: Session = Depends(get_db)):
    """Public — list all package categories."""
    return db.query(PackageCategory).order_by(PackageCategory.id).all()


@router.get("/{slug}", response_model=PackageCategoryRead)
def get_category(slug: str, db: Session = Depends(get_db)):
    """Public — get a category by slug."""
    cat = db.query(PackageCategory).filter(PackageCategory.slug == slug).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return cat


@router.post("", response_model=PackageCategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: PackageCategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — create a new package category."""
    existing = db.query(PackageCategory).filter(PackageCategory.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category with this slug already exists")
    cat = PackageCategory(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{slug}", response_model=PackageCategoryRead)
def update_category(
    slug: str,
    payload: PackageCategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — update a category."""
    cat = db.query(PackageCategory).filter(PackageCategory.slug == slug).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    slug: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — delete a category (packages with this category become unlinked)."""
    cat = db.query(PackageCategory).filter(PackageCategory.slug == slug).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    db.delete(cat)
    db.commit()

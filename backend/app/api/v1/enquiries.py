from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.enquiry import Enquiry
from app.models.user import User
from app.schemas.enquiry import EnquiryCreate, EnquiryRead

router = APIRouter()


@router.post("", response_model=EnquiryRead, status_code=status.HTTP_201_CREATED)
def submit_enquiry(payload: EnquiryCreate, db: Session = Depends(get_db)):
    """Public — anyone can submit an enquiry."""
    enquiry = Enquiry(**payload.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.get("", response_model=list[EnquiryRead])
def list_enquiries(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — list all enquiries."""
    return db.query(Enquiry).order_by(Enquiry.id.desc()).all()

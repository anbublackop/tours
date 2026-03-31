from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_admin
from app.db.session import get_db
from app.models.booking import Booking
from app.models.package import Package
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingRead

router = APIRouter()


@router.get("", response_model=list[BookingRead])
def list_all_bookings(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — list every booking."""
    return db.query(Booking).order_by(Booking.id.desc()).all()


@router.get("/my", response_model=list[BookingRead])
def list_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated — list the current user's bookings."""
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.id.desc())
        .all()
    )


@router.get("/{booking_id}", response_model=BookingRead)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated — get a single booking (own bookings; admin sees any)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return booking


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated — create a booking for the current user."""
    pkg = db.query(Package).filter(Package.id == payload.package_id).first()
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")

    # Calculate total price: base * people + hotel cost + transport + addons
    hotel_price_per_night = 0
    transport_price = 0
    addon_total = 0
    nights = (pkg.duration_days or 1) - 1

    if payload.hotel_id and pkg.hotels:
        hotel = next((h for h in pkg.hotels if h.get("id") == payload.hotel_id), None)
        if hotel:
            hotel_price_per_night = hotel.get("pricePerNight", 0)

    if payload.transport_id and pkg.transport:
        transport = next((t for t in pkg.transport if t.get("id") == payload.transport_id), None)
        if transport:
            transport_price = transport.get("price", 0)

    if payload.selected_addons and pkg.addons:
        for addon in pkg.addons:
            if addon.get("id") in payload.selected_addons:
                addon_total += addon.get("price", 0)

    total_per_person = pkg.price + (hotel_price_per_night * nights) + transport_price + addon_total
    grand_total = total_per_person * payload.num_people

    now = str(datetime.utcnow())
    booking = Booking(
        user_id=current_user.id,
        package_id=payload.package_id,
        package_title=pkg.title,
        user_name=current_user.name,
        status="confirmed",
        total_price=grand_total,
        booking_date=now,
        travel_date=payload.travel_date,
        num_people=payload.num_people,
        special_requests=payload.special_requests,
        payment_status="pending",
        payment_method=payload.payment_method,
        hotel_id=payload.hotel_id,
        transport_id=payload.transport_id,
        selected_addons=payload.selected_addons or [],
        created_at=now,
        updated_at=now,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.put("/{booking_id}/cancel", response_model=BookingRead)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated — cancel own booking (admin can cancel any)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if booking.status == "cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Booking is already cancelled")

    booking.status = "cancelled"
    booking.updated_at = str(datetime.utcnow())
    db.commit()
    db.refresh(booking)
    return booking

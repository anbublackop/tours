from app.core.security import create_access_token, create_refresh_token, get_current_user, get_current_user, verify_password
from app.schemas.token import LoginRequest, TokenResponse
from app.db.session import get_db
from app.models.refresh_tokens import RefreshToken
from app.utils.common import get_expiry
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    # Store refresh token in DB
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=get_expiry(type="days", value=7)
    )
    db.add(db_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    # In a real app, you'd verify the token and extract user info
    return {"message": "This is a protected route", "user": current_user.email}
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.schemas.token import LoginRequest, TokenResponse
from app.db.session import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

# @router.get("/protected")
# def protected_route(token: str = Depends(oauth2_scheme)):
#     # In a real app, you'd verify the token and extract user info
#     return {"message": "This is a protected route", "token": token}
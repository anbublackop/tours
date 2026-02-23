from asyncio.log import logger
from passlib.context import CryptContext
from jose import jwt, JWTError
from app.core.config import settings
from app.utils.common import get_expiry
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = get_expiry(type="minutes", value=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = get_expiry(type="days", value=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def decode_token(token: str):
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])

# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
#         username: str = payload.get("sub")
#         if username is None:
#             raise HTTPException(status_code=401)
#         return username
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(
    access_token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
        logger.info(f"Decoded token payload: {payload}")
        user_id = payload.get("sub")
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# def require_role(role: str):
#     def checker(current_user=Depends(get_current_user)):
#         if current_user.role != role:
#             raise HTTPException(status_code=403, detail="Forbidden")
#         return current_user
#     return checker
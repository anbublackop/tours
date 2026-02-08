import hashlib
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.core.config import settings
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import hashlib

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# def _prehash(password: str) -> str:
#     return hashlib.sha256(password.encode("utf-8")).hexdigest()

def hash_password(password: str) -> str:
    sha = hashlib.sha256(password.encode("utf-8")).digest()
    return pwd_context.hash(sha)

def verify_password(password: str, hashed: str) -> bool:
    sha = hashlib.sha256(password.encode("utf-8")).digest()
    return pwd_context.verify(sha, hashed)

# def hash_password(password: str):
#     return pwd_context.hash(password[:72])

# def verify_password(password, hashed):
#     return pwd_context.verify(password[:72], hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401)
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# def require_role(role: str):
#     def checker(current_user=Depends(get_current_user)):
#         if current_user.role != role:
#             raise HTTPException(status_code=403, detail="Forbidden")
#         return current_user
#     return checker
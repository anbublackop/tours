from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

def require_role(role: str):
    def checker(current_user=Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user
    return checker
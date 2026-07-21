from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

load_dotenv()
router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["techmart_support"]

# --- ADD THESE MODELS ---
class LoginBody(BaseModel):
    username: str
    password: str

class RegisterBody(BaseModel):
    username: str
    email : str
    password: str
# -------------------------

@router.post("/register")
def register(body: RegisterBody):
    try:
        if db.users.find_one({"username": body.username}):
            raise HTTPException(status_code=400, detail="User already exists")
        if db.users.find_one({"email": body.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        db.users.insert_one({"username": body.username, "password": pwd_context.hash(body.password),"email": body.email})
        return {"message": "User registered successfully"}
    except HTTPException:
        raise # Re-raise our intentional errors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/login")
def login(body: LoginBody):
    try:
        user = db.users.find_one({"username": body.username})
        if not user or not pwd_context.verify(body.password, user["password"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        expire = datetime.utcnow() + timedelta(hours=24)
        
        # EMBED EMAIL IN JWT TOKEN
        token = jwt.encode({
            "sub": body.username, 
            "email": user.get("email", ""), # Add email to token payload
            "exp": expire
        }, SECRET_KEY, algorithm=ALGORITHM)
        
        return {"access_token": token, "token_type": "bearer", "username": body.username}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    session_id: str

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
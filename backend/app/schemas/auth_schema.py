from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str
    fullName: str
    role: str = "Student"

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str

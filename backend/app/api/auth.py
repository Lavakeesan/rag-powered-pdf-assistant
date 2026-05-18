from fastapi import APIRouter, HTTPException
from app.schemas.auth_schema import UserRegister, UserLogin
from app.services import auth_service

router = APIRouter(prefix="", tags=["Authentication"])

@router.post("/register")
async def register(user: UserRegister):
    if not user.email or not user.password or not user.fullName:
        raise HTTPException(status_code=400, detail="Missing required fields")
    try:
        result = auth_service.register_new_user(user)
        return {"message": "Registration successful", "user": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Missing email or password")
    try:
        result = auth_service.authenticate_user(user)
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

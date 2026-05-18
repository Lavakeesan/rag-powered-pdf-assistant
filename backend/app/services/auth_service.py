import datetime
import logging
from app.core import security
from app.database import user_table
from app.schemas.auth_schema import UserRegister, UserLogin

logger = logging.getLogger(__name__)

def register_new_user(user: UserRegister) -> dict:
    # Check if user already exists
    existing_user = user_table.get_user(user.email)
    if existing_user:
        raise Exception("User with this email already exists")
    
    hashed_pwd = security.hash_password(user.password)
    
    user_item = {
        'email': user.email,
        'password': hashed_pwd,
        'full_name': user.fullName,
        'role': user.role
    }
    
    user_table.save_user(user_item)
    logger.info(f"Successfully registered user: {user.email}")
    
    return {
        'email': user.email,
        'fullName': user.fullName,
        'role': user.role
    }

def authenticate_user(user: UserLogin) -> dict:
    db_user = user_table.get_user(user.email)
    if not db_user:
        raise Exception("Invalid email or password")
    
    if not security.verify_password(user.password, db_user["password"]):
        raise Exception("Invalid email or password")
    
    # Generate JWT token
    token = security.create_access_token(
        user_data={
            "email": db_user["email"],
            "fullName": db_user["full_name"],
            "role": db_user["role"]
        }
    )
    
    return {
        "token": token,
        "user": {
            "email": db_user["email"],
            "fullName": db_user["full_name"],
            "role": db_user["role"]
        }
    }

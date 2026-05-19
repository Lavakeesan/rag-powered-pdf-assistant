import datetime
import logging
import uuid
from app.core import security
from app.core.config import config
from app.database import user_table
from app.schemas.auth_schema import UserRegister, UserLogin

logger = logging.getLogger(__name__)

def register_new_user(user: UserRegister) -> dict:
    # Check if user already exists
    existing_user = user_table.get_user(user.email)
    if existing_user:
        raise Exception("User with this email already exists")
    
    hashed_pwd = security.hash_password(user.password)
    user_id = str(uuid.uuid4())
    
    user_item = {
        'user_id': user_id,
        'email': user.email,
        'password': hashed_pwd,
        'full_name': user.fullName,
        'role': user.role
    }
    
    user_table.save_user(user_item)
    logger.info(f"Successfully registered user: {user.email} with ID: {user_id}")
    
    return {
        'userId': user_id,
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
    
    # Dynamic fallback for existing users without userId
    if "user_id" not in db_user:
        db_user["user_id"] = str(uuid.uuid4())
        user_table.save_user(db_user)
        logger.info(f"Dynamically generated userId for existing user: {db_user['email']}")
    
    # Generate JWT token
    token = security.create_access_token(
        user_data={
            "userId": db_user["user_id"],
            "email": db_user["email"],
            "fullName": db_user["full_name"],
            "role": db_user["role"]
        }
    )
    
    return {
        "token": token,
        "user": {
            "userId": db_user["user_id"],
            "email": db_user["email"],
            "fullName": db_user["full_name"],
            "role": db_user["role"]
        }
    }

def login_with_google(credential: str) -> dict:
    import urllib.request
    import json
    
    # 1. Verify token with Google API
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
    try:
        import ssl
        context = ssl._create_unverified_context()
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, context=context) as response:
            token_info = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        logger.error(f"Failed to verify Google token: {str(e)}")
        raise Exception(f"Invalid Google credential: {str(e)}")

    # 2. Check audience matches our client ID
    google_client_id = config.GOOGLE_CLIENT_ID
    if token_info.get("aud") != google_client_id:
        logger.error(f"Google Token audience mismatch: {token_info.get('aud')} != {google_client_id}")
        raise Exception(f"Token audience mismatch. Client ID: {google_client_id}, Token aud: {token_info.get('aud')}")

    email = token_info.get("email")
    if not email:
        raise Exception("Email not provided by Google")
        
    full_name = token_info.get("name", email.split('@')[0])
    
    # 3. Check if user already exists
    db_user = user_table.get_user(email)
    if not db_user:
        # Register new Google user
        user_id = str(uuid.uuid4())
        user_item = {
            'user_id': user_id,
            'email': email,
            'password': security.hash_password("google-auth-no-password-" + email),
            'full_name': full_name,
            'role': 'Student'
        }
        user_table.save_user(user_item)
        logger.info(f"Successfully registered new Google user: {email} with ID: {user_id}")
        db_user = user_item
    else:
        # Dynamic fallback for existing Google users without userId
        if "user_id" not in db_user:
            db_user["user_id"] = str(uuid.uuid4())
            user_table.save_user(db_user)
            logger.info(f"Dynamically generated userId for existing Google user: {db_user['email']}")

    # 4. Generate JWT token
    token = security.create_access_token(
        user_data={
            "userId": db_user["user_id"],
            "email": db_user["email"],
            "fullName": db_user["full_name"],
            "role": db_user["role"]
        }
    )
    
    return {
        "token": token,
        "user": {
            "userId": db_user["user_id"],
            "email": db_user["email"],
            "fullName": db_user["full_name"],
            "role": db_user["role"]
        }
    }


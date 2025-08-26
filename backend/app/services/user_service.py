from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserLoginRequest, TokenResponse, UserResponse
from app.core.security import verify_password, create_access_token
from app.core.settings import get_settings

settings = get_settings()

async def authenticate_user(email: str, password: str, db: Session) -> User:
    """Authenticate user credentials"""
    
    # Find user by email
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check password
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Check if email is verified
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first."
        )
    
    return user

async def create_user_tokens(user: User, db: Session) -> TokenResponse:
    """Create JWT tokens for user"""
    
    # Update last login
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    
    # Create token data
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": f"{user.first_name} {user.last_name}",
    }
    
    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data=token_data,
        expires_delta=access_token_expires
    )
    
    # Create user response
    user_response = UserResponse.from_orm(user)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )

async def login_user(login_data: UserLoginRequest, db: Session) -> dict:
    """Complete login process"""
    
    # Authenticate user
    user = await authenticate_user(login_data.email, login_data.password, db)
    
    # Create tokens
    token_response = await create_user_tokens(user, db)
    
    return {
        "success": True,
        "message": f"Welcome back, {user.first_name}!",
        "data": token_response
    }

def get_user_by_id(user_id: int, db: Session) -> User:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()
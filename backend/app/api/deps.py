from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.db.database import get_db

def get_database() -> Generator[Session, None, None]:
    """
    Dependency to get database session
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = get_db()
    try:
        yield next(db)
    finally:
        pass

# Common database dependency
db_dependency = Depends(get_database)

# Security scheme for JWT tokens
security = HTTPBearer()

async def get_current_user(
    token: str = Depends(security),
    db: Session = db_dependency
) -> "User":
    """
    Get current authenticated user from JWT token
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        User: Current authenticated user
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    from app.core.security import get_user_id_from_token
    from app.services.user_service import get_user_by_id
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Extract user ID from token
        user_id = get_user_id_from_token(token.credentials)
        if user_id is None:
            raise credentials_exception
            
    except Exception:
        raise credentials_exception
    
    # Get user from database
    user = get_user_by_id(user_id, db)
    if user is None:
        raise credentials_exception
        
    # Check if user is still active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account deactivated"
        )
    
    return user

# Error handling utilities
class APIError:
    """Common API error responses"""
    
    @staticmethod
    def user_not_found(user_id: int = None, email: str = None):
        """User not found error"""
        detail = "User not found"
        if user_id:
            detail = f"User with ID {user_id} not found"
        elif email:
            detail = f"User with email {email} not found"
            
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )
    
    @staticmethod
    def email_already_exists(email: str):
        """Email already registered error"""
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {email} is already registered"
        )
    
    @staticmethod
    def invalid_credentials():
        """Invalid login credentials error"""
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    @staticmethod
    def weak_password():
        """Weak password error"""
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
        )
    
    @staticmethod
    def internal_server_error(message: str = "Internal server error"):
        """Generic server error"""
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=message
        )
    
    @staticmethod
    def validation_error(field: str, message: str):
        """Field validation error"""
        return HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field}: {message}"
        )

# Request validation helpers
class RequestValidator:
    """Request validation utilities"""
    
    @staticmethod
    def validate_email_format(email: str) -> bool:
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Validate password strength
        
        Returns:
            tuple: (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one number"
        
        special_chars = "!@#$%^&*(),.?\":{}|<>"
        if not any(c in special_chars for c in password):
            return False, "Password must contain at least one special character"
        
        return True, ""
    
    @staticmethod
    def validate_name(name: str, field_name: str) -> tuple[bool, str]:
        """
        Validate name fields
        
        Args:
            name: Name to validate
            field_name: Field name for error message
            
        Returns:
            tuple: (is_valid, error_message)
        """
        if not name or len(name.strip()) == 0:
            return False, f"{field_name} is required"
        
        if len(name.strip()) < 1:
            return False, f"{field_name} must be at least 1 character"
        
        if len(name.strip()) > 100:
            return False, f"{field_name} must be less than 100 characters"
        
        return True, ""

# Response utilities
class ResponseFormatter:
    """Response formatting utilities"""
    
    @staticmethod
    def success_response(message: str, data: dict = None):
        """Format success response"""
        response = {"success": True, "message": message}
        if data:
            response["data"] = data
        return response
    
    @staticmethod
    def error_response(message: str, errors: list = None):
        """Format error response"""
        response = {"success": False, "message": message}
        if errors:
            response["errors"] = errors
        return response
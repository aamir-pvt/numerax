from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.schemas.user import (
    VerificationRequest, VerificationRequestResponse, 
    EmailVerificationRequest, EmailVerificationResponse, 
    ResendVerificationRequest, UserResponse,
    UserLoginRequest, LoginResponse  # ← Added these imports
)
from app.services.verification_service import (
    request_email_verification, 
    verify_email_and_create_user, 
    resend_verification_email
)
from app.services.user_service import login_user  # ← Added this import
from app.api.deps import db_dependency, get_current_user  # ← Added get_current_user

# Create router for authentication endpoints
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={404: {"description": "Not found"}},
)

# ==========================================
# EXISTING REGISTRATION ENDPOINTS
# ==========================================

@router.post(
    "/request-verification",
    response_model=VerificationRequestResponse,
    status_code=status.HTTP_200_OK,
    summary="Request Email Verification",
    description="Start the registration process by requesting email verification. User data is stored temporarily until email is verified."
)
async def request_verification(
    verification_data: VerificationRequest,
    db: Session = db_dependency
):
    """
    Request email verification to start registration process.
    
    - **email**: Valid email address (must be unique)
    - **password**: Strong password (8+ chars, uppercase, lowercase, number, special char)
    - **first_name**: User's first name  
    - **last_name**: User's last name
    - **company**: Optional company name
    - **job_title**: Optional job title
    
    Sends verification email with a link that expires in 24 hours.
    User account is only created after email verification.
    """
    
    result = await request_email_verification(verification_data, db)
    return result


@router.get(
    "/verify-email",
    response_model=EmailVerificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Verify Email and Create Account",
    description="Verify email address and create the actual user account. Called when user clicks verification link."
)
async def verify_email(
    token: str = Query(..., description="Verification token from email"),
    email: str = Query(..., description="User's email address"),
    db: Session = db_dependency
):
    """
    Verify email and create user account.
    
    This endpoint is called when user clicks the verification link in their email.
    - Validates the verification token
    - Creates the actual user account
    - Returns the created user data
    """
    
    # Create user account after successful verification
    new_user = await verify_email_and_create_user(token, email, db)
    
    return {
        "success": True,
        "message": f"Email verified successfully! Welcome to Numeraxial, {new_user.first_name}!",
        "user": new_user
    }


@router.post(
    "/resend-verification",
    response_model=VerificationRequestResponse,
    status_code=status.HTTP_200_OK,
    summary="Resend Verification Email",
    description="Resend verification email for pending registration."
)
async def resend_verification(
    resend_data: ResendVerificationRequest,
    db: Session = db_dependency
):
    """
    Resend verification email for pending registration.
    
    - **email**: Email address with pending registration
    
    Generates a new verification token and sends a new email.
    """
    
    result = await resend_verification_email(resend_data.email, db)
    return result

# ==========================================
# 🆕 NEW LOGIN ENDPOINTS
# ==========================================

@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="User Login",
    description="Authenticate user with email and password, returns JWT access token"
)
async def login(
    login_data: UserLoginRequest,
    db: Session = db_dependency
):
    """
    Authenticate user and return JWT access token.
    
    - **email**: Verified email address
    - **password**: User's password
    
    Returns:
    - **access_token**: JWT token for authenticated requests
    - **token_type**: Bearer token type
    - **expires_in**: Token expiration time in seconds
    - **user**: User profile information
    
    The token must be included in Authorization header for protected endpoints:
    `Authorization: Bearer <your-token>`
    """
    
    result = await login_user(login_data, db)
    return result


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current User Profile",
    description="Get current authenticated user's profile information"
)
async def get_current_user_profile(
    current_user = Depends(get_current_user)
):
    """
    Get current user's profile information.
    
    **Requires Authentication**: Include JWT token in Authorization header:
    `Authorization: Bearer <your-jwt-token>`
    
    Returns complete user profile including:
    - User ID and email
    - Name and company information
    - Account status and membership tier
    - Account creation date
    """
    return current_user

# ==========================================
# HEALTH CHECK
# ==========================================

@router.get(
    "/health",
    summary="Auth Service Health Check",
    description="Check if authentication service is working"
)
async def auth_health_check():
    """Health check endpoint for authentication service"""
    return {
        "status": "healthy",
        "service": "authentication",
        "message": "Auth service with email verification and login is running properly",
        "available_endpoints": [
            "POST /auth/request-verification",
            "GET /auth/verify-email",
            "POST /auth/resend-verification",
            "POST /auth/login",  # ← Added
            "GET /auth/me"       # ← Added
        ]
    }
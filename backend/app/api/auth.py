from fastapi import APIRouter, Depends, status, Query, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import (
    VerificationRequest, VerificationRequestResponse, 
    EmailVerificationResponse, ResendVerificationRequest, UserResponse,
    UserLoginRequest, LoginResponse, PasswordResetRequest, PasswordResetConfirm
)

from app.services.verification_service import (
    request_email_verification, 
    verify_email_and_create_user, 
    resend_verification_email
)
from app.services.user_service import login_user
from app.api.deps import db_dependency, get_current_user
from app.core.tokens import create_reset_token, verify_reset_token
from app.core.security import hash_password, is_password_strong
from app.services.email_service import send_reset_email
from app.models.user import User

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
    result = await resend_verification_email(resend_data.email, db)
    return result

# ==========================================
# LOGIN ENDPOINTS
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
    return current_user

# ==========================================
# NEW PASSWORD RESET ENDPOINTS
# ==========================================

@router.post(
    "/request-password-reset",
    status_code=status.HTTP_200_OK,
    summary="Request Password Reset",
    description="Send a password reset link to the user's email"
)
async def request_password_reset(
    body: PasswordResetRequest,
    db: Session = db_dependency
):
    user = db.query(User).filter(User.email == body.email).first()
    if user:
        token = create_reset_token(user.id)
        reset_link = f"https://your-frontend/reset-password?token={token}"
        await send_reset_email(user.email, reset_link)
    # Do not disclose if user exists
    return {"message": "we have sent the reset the to your mail!."}


@router.post(
    "/reset-password",
    status_code=status.HTTP_200_OK,
    summary="Reset Password",
    description="Reset password using a valid reset token"
)
async def reset_password(
    body: PasswordResetConfirm,
    db: Session = db_dependency
):
    user_id = verify_reset_token(body.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not is_password_strong(body.new_password):
        raise HTTPException(status_code=400, detail="Weak password")

    user.password_hash = hash_password(body.new_password)
    db.commit()
    return {"message": "Password has been successfully reset."}

# ==========================================
# HEALTH CHECK
# ==========================================

@router.get(
    "/health",
    summary="Auth Service Health Check",
    description="Check if authentication service is working"
)
async def auth_health_check():
    return {
        "status": "healthy",
        "service": "authentication",
        "message": "Auth service with email verification, login, and password reset is running properly",
        "available_endpoints": [
            "POST /auth/request-verification",
            "GET /auth/verify-email",
            "POST /auth/resend-verification",
            "POST /auth/login",
            "GET /auth/me",
            "POST /auth/request-password-reset",
            "POST /auth/reset-password"
        ]
    }

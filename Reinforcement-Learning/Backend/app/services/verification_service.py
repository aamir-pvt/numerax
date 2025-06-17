from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User, UserUsage, PendingRegistration
from app.schemas.user import VerificationRequest
from app.core.security import hash_password, is_password_strong
from app.core.tokens import TokenGenerator


async def request_email_verification(verification_data: VerificationRequest, db: Session) -> dict:
    """
    Create pending registration and send verification email
    
    Args:
        verification_data: User registration data
        db: Database session
        
    Returns:
        dict: Response with verification details
        
    Raises:
        HTTPException: If validation fails or email already exists
    """
    
    # Check if email already exists in users table
    existing_user = db.query(User).filter(User.email == verification_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please use a different email or try logging in."
        )
    
    # Check if there's already a pending registration for this email
    existing_pending = db.query(PendingRegistration).filter(
        PendingRegistration.email == verification_data.email,
        PendingRegistration.is_used == False
    ).first()
    
    if existing_pending and not existing_pending.is_expired():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification email already sent. Please check your inbox or request a new one."
        )
    
    # Validate password strength
    if not is_password_strong(verification_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
        )
    
    try:
        # Delete any existing expired pending registrations for this email
        db.query(PendingRegistration).filter(
            PendingRegistration.email == verification_data.email
        ).delete()
        
        # Generate verification token
        token, expires_at = TokenGenerator.generate_token_with_expiry(hours=24)
        
        # Create pending registration
        pending_registration = PendingRegistration(
            verification_token=token,
            email=verification_data.email,
            password_hash=hash_password(verification_data.password),
            first_name=verification_data.first_name,
            last_name=verification_data.last_name,
            company=verification_data.company,
            job_title=verification_data.job_title,
            expires_at=expires_at,
            is_used=False
        )
        
        db.add(pending_registration)
        db.commit()
        db.refresh(pending_registration)
        
        # Send verification email
        from app.services.email_service import EmailService
        email_sent = await EmailService.send_verification_email(
            email=verification_data.email,
            token=token,
            first_name=verification_data.first_name
        )
        
        if not email_sent:
            # If email fails, still return success but note it in logs
            logging.warning(f"Failed to send verification email to {verification_data.email}")
        
        return {
            "success": True,
            "message": f"Verification email sent to {verification_data.email}. Please check your inbox and click the verification link to complete registration.",
            "email": verification_data.email,
            "expires_in_hours": 24
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process verification request. Please try again."
        )


async def verify_email_and_create_user(token: str, email: str, db: Session) -> User:
    """
    Verify email token and create actual user account
    
    Args:
        token: Verification token from email
        email: User's email address
        db: Database session
        
    Returns:
        User: Created user object
        
    Raises:
        HTTPException: If verification fails
    """
    
    # Find pending registration
    pending = db.query(PendingRegistration).filter(
        PendingRegistration.verification_token == token,
        PendingRegistration.email == email,
        PendingRegistration.is_used == False
    ).first()
    
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token."
        )
    
    # Check if token is expired
    if pending.is_expired():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new verification email."
        )
    
    # Check if email already exists (race condition protection)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    try:
        # Create actual user account
        new_user = User(
            email=pending.email,
            password_hash=pending.password_hash,
            first_name=pending.first_name,
            last_name=pending.last_name,
            company=pending.company,
            job_title=pending.job_title,
            is_active=True,
            email_verified=True,  # Already verified!
            membership_tier="free",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create initial usage tracking
        current_month = datetime.now(timezone.utc).strftime("%Y-%m")
        user_usage = UserUsage(
            user_id=new_user.id,
            month_year=current_month,
            company_analyses_used=0,
            model_trainings_used=0,
            api_calls_made=0
        )
        
        db.add(user_usage)
        
        # Mark pending registration as used
        pending.is_used = True
        db.commit()
        
        # Send welcome email
        from app.services.email_service import EmailService
        await EmailService.send_welcome_email(
            email=new_user.email,
            first_name=new_user.first_name
        )
        
        return new_user
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account. Please try again."
        )


async def resend_verification_email(email: str, db: Session) -> dict:
    """
    Resend verification email for pending registration
    
    Args:
        email: User's email address
        db: Database session
        
    Returns:
        dict: Response with resend details
    """
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified and registered."
        )
    
    # Find pending registration
    pending = db.query(PendingRegistration).filter(
        PendingRegistration.email == email,
        PendingRegistration.is_used == False
    ).first()
    
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending registration found for this email."
        )
    
    try:
        # Generate new token
        new_token, new_expires_at = TokenGenerator.generate_token_with_expiry(hours=24)
        
        # Update pending registration with new token
        pending.verification_token = new_token
        pending.expires_at = new_expires_at
        pending.created_at = datetime.now(timezone.utc)
        
        db.commit()
        
        # Send new verification email
        from app.services.email_service import EmailService
        await EmailService.send_verification_email(
            email=email,
            token=new_token,
            first_name=pending.first_name
        )
        
        return {
            "success": True,
            "message": f"New verification email sent to {email}.",
            "expires_in_hours": 24
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to resend verification email. Please try again."
        )
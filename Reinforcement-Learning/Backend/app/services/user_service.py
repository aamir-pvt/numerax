from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User, UserUsage
from app.schemas.user import UserRegisterRequest
from app.core.security import hash_password, is_password_strong


async def check_email_exists(email: str, db: Session) -> bool:
    """Check if email already exists in database"""
    existing_user = db.query(User).filter(User.email == email).first()
    return existing_user is not None


async def create_user_account(user_data: UserRegisterRequest, db: Session) -> User:
    """
    Create a new user account with validation
    
    Args:
        user_data: UserRegisterRequest with user details
        db: Database session
        
    Returns:
        User: Created user object
        
    Raises:
        HTTPException: If validation fails or user already exists
    """
    
    # Check if email already exists
    if await check_email_exists(user_data.email, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please use a different email or try logging in."
        )
    
    # Validate password strength
    if not is_password_strong(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        company=user_data.company,
        job_title=user_data.job_title,
        is_active=True,
        email_verified=False,  # TODO: Implement email verification later
        membership_tier="free",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    try:
        # Add user to database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create initial usage tracking record
        current_month = datetime.now(timezone.utc).strftime("%Y-%m")
        user_usage = UserUsage(
            user_id=new_user.id,
            month_year=current_month,
            company_analyses_used=0,
            model_trainings_used=0,
            api_calls_made=0
        )
        
        db.add(user_usage)
        db.commit()
        
        return new_user
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account. Please try again."
        )


def get_user_by_email(email: str, db: Session) -> User:
    """Get user by email address"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(user_id: int, db: Session) -> User:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()


def get_user_usage(user_id: int, month_year: str, db: Session) -> UserUsage:
    """Get user usage for specific month"""
    return db.query(UserUsage).filter(
        UserUsage.user_id == user_id,
        UserUsage.month_year == month_year
    ).first()


def increment_usage(user_id: int, usage_type: str, db: Session) -> UserUsage:
    """
    Increment usage counter for user
    
    Args:
        user_id: User ID
        usage_type: 'analyses', 'trainings', or 'api_calls'
        db: Database session
        
    Returns:
        UserUsage: Updated usage record
    """
    current_month = datetime.now(timezone.utc).strftime("%Y-%m")
    
    # Get or create usage record for current month
    usage = get_user_usage(user_id, current_month, db)
    if not usage:
        usage = UserUsage(
            user_id=user_id,
            month_year=current_month,
            company_analyses_used=0,
            model_trainings_used=0,
            api_calls_made=0
        )
        db.add(usage)
    
    # Increment appropriate counter
    if usage_type == "analyses":
        usage.company_analyses_used += 1
    elif usage_type == "trainings":
        usage.model_trainings_used += 1
    elif usage_type == "api_calls":
        usage.api_calls_made += 1
    
    usage.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(usage)
    
    return usage
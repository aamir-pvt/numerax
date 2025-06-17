from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"
    
    # Basic Info
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(100), nullable=False)
    
    # Profile Info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    company = Column(String(200), nullable=True)
    job_title = Column(String(100), nullable=True)
    
    # Account Status
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    
    # Membership
    membership_tier = Column(String(20), default="free")  # free, pro, enterprise
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=True, default=None, onupdate=datetime.now)
    last_login_at = Column(DateTime, nullable=True)





class PendingRegistration(Base):
    __tablename__ = "pending_registrations"
    
    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Verification Token
    verification_token = Column(String(255), unique=True, nullable=False, index=True)
    
    # User Data (stored temporarily until verified)
    email = Column(String(255), nullable=False, index=True)
    password_hash = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    company = Column(String(200), nullable=True)
    job_title = Column(String(100), nullable=True)
    
    # Token Management
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    expires_at = Column(DateTime, nullable=False)
    
    # Status tracking
    is_used = Column(Boolean, default=False)  # Prevent token reuse
    
    def is_expired(self) -> bool:
        """Check if verification token has expired"""
        return datetime.now(timezone.utc) > self.expires_at
    
    def is_valid(self) -> bool:
        """Check if token is valid (not used and not expired)"""
        return not self.is_used and not self.is_expired()

class UserUsage(Base):
    __tablename__ = "user_usage"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)  # Foreign key to users
    
    # Usage Period
    month_year = Column(String(7), nullable=False)  # Format: '2025-06'
    
    # Usage Counters
    company_analyses_used = Column(Integer, default=0)
    model_trainings_used = Column(Integer, default=0)
    api_calls_made = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now)
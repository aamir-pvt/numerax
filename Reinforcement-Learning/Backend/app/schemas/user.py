from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# Request Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    company: Optional[str] = Field(None, max_length=200)
    job_title: Optional[str] = Field(None, max_length=100)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

# Response Schemas
class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    company: Optional[str] = None
    job_title: Optional[str] = None
    membership_tier: str
    is_active: bool
    email_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class UserUsageResponse(BaseModel):
    month_year: str
    company_analyses_used: int
    model_trainings_used: int
    api_calls_made: int
    
    class Config:
        from_attributes = True



from pydantic import BaseModel, EmailStr, Field

# Request to start verification process
class VerificationRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    company: Optional[str] = Field(None, max_length=200)
    job_title: Optional[str] = Field(None, max_length=100)

# Response after requesting verification
class VerificationRequestResponse(BaseModel):
    success: bool
    message: str
    email: str
    expires_in_hours: int

# Email verification request (from link click)
class EmailVerificationRequest(BaseModel):
    token: str
    email: EmailStr

# Response after successful verification
class EmailVerificationResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse

# Resend verification request
class ResendVerificationRequest(BaseModel):
    email: EmailStr


# Add these to your existing schemas

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class LoginResponse(BaseModel):
    success: bool
    message: str
    data: TokenResponse
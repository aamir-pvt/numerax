import secrets
import string
from datetime import datetime, timezone, timedelta
from typing import Tuple, Optional
from jose import jwt, JWTError
from app.core.settings import get_settings

settings = get_settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"

class TokenGenerator:
    """Utility class for generating secure tokens"""

    @staticmethod
    def generate_verification_token(length: int = 32) -> str:
        """
        Generate a secure random token for email verification
        """
        alphabet = string.ascii_letters + string.digits + '-_'
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    @staticmethod
    def generate_token_with_expiry(hours: int = 24) -> Tuple[str, datetime]:
        """
        Generate verification token with expiration time
        """
        token = TokenGenerator.generate_verification_token()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=hours)
        return token, expires_at

    @staticmethod
    def is_token_expired(expires_at: datetime) -> bool:
        """
        Check if token has expired
        """
        current_time = datetime.now(timezone.utc)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return current_time > expires_at

    @staticmethod
    def time_until_expiry(expires_at: datetime) -> timedelta:
        """
        Get time remaining until token expires
        """
        current_time = datetime.now(timezone.utc)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return expires_at - current_time

# ============================================================
# 🆕 Password Reset Token Helpers (JWT-based)
# ============================================================

def create_reset_token(user_id: int, expires_minutes: int = 30) -> str:
    """
    Create a JWT-based password reset token
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode = {"sub": str(user_id), "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token: str) -> Optional[int]:
    """
    Verify a password reset token and return the user_id if valid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return int(user_id)
    except JWTError:
        return None

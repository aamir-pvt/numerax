import secrets
import string
from datetime import datetime, timezone, timedelta
from typing import Tuple

class TokenGenerator:
    """Utility class for generating secure tokens"""
    
    @staticmethod
    def generate_verification_token(length: int = 32) -> str:
        """
        Generate a secure random token for email verification
        
        Args:
            length: Length of the token (default 32 characters)
            
        Returns:
            str: Secure random token
        """
        # Use URL-safe characters for tokens that go in URLs
        alphabet = string.ascii_letters + string.digits + '-_'
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    @staticmethod
    def generate_token_with_expiry(hours: int = 24) -> Tuple[str, datetime]:
        """
        Generate verification token with expiration time
        
        Args:
            hours: Hours until token expires (default 24)
            
        Returns:
            tuple: (token, expiration_datetime)
        """
        token = TokenGenerator.generate_verification_token()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=hours)
        return token, expires_at
    
    @staticmethod
    def is_token_expired(expires_at: datetime) -> bool:
        """Check if token has expired"""
        return datetime.now(timezone.utc) > expires_at
    
    @staticmethod
    def time_until_expiry(expires_at: datetime) -> timedelta:
        """Get time remaining until token expires"""
        return expires_at - datetime.now(timezone.utc)
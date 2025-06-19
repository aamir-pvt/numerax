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
            tuple: (token, expiration_datetime) - both timezone-aware
        """
        token = TokenGenerator.generate_verification_token()
        # Fix: Always use timezone-aware datetime
        expires_at = datetime.now(timezone.utc) + timedelta(hours=hours)
        return token, expires_at
    
    @staticmethod
    def is_token_expired(expires_at: datetime) -> bool:
        """
        Check if token has expired
        
        Args:
            expires_at: Expiration datetime (can be naive or aware)
            
        Returns:
            bool: True if expired
        """
        current_time = datetime.now(timezone.utc)
        
        # Handle timezone-naive datetimes by assuming UTC
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
            
        return current_time > expires_at
    
    @staticmethod
    def time_until_expiry(expires_at: datetime) -> timedelta:
        """
        Get time remaining until token expires
        
        Args:
            expires_at: Expiration datetime
            
        Returns:
            timedelta: Time remaining (negative if expired)
        """
        current_time = datetime.now(timezone.utc)
        
        # Handle timezone-naive datetimes
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
            
        return expires_at - current_time
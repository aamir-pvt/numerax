import logging
from typing import Optional
from app.core.settings import get_settings

settings = get_settings()


class EmailService:
    """Email service for sending verification, reset, and notification emails"""
    
    @staticmethod
    async def send_verification_email(email: str, token: str, first_name: str) -> bool:
        verification_url = f"http://localhost:8000/api/auth/verify-email?token={token}&email={email}"
        
        email_content = f"""
        ================================================
        📧 EMAIL VERIFICATION - Numeraxial Platform
        ================================================
        
        To: {email}
        Subject: Verify your email - Welcome to Numeraxial!
        
        Hi {first_name},
        
        Welcome to Numeraxial Platform! 🚀
        
        Please click the link below to verify your email and complete your registration:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        Best regards,
        The Numeraxial Team
        ================================================
        """
        
        print(email_content)
        logging.info(f"Verification email sent to {email}")
        return True

    @staticmethod
    async def send_welcome_email(email: str, first_name: str) -> bool:
        welcome_content = f"""
        ================================================
        🎉 WELCOME EMAIL - Numeraxial Platform
        ================================================
        
        To: {email}
        Subject: Welcome to Numeraxial Platform!
        
        Hi {first_name},
        
        Your email has been verified successfully! 🎉
        
        Get started: http://localhost:8000/docs
        
        Happy investing!
        
        Best regards,
        The Numeraxial Team
        ================================================
        """
        print(welcome_content)
        logging.info(f"Welcome email sent to {email}")
        return True

    @staticmethod
    async def send_password_reset_email(email: str, reset_link: str) -> bool:
        """
        Send password reset email
        """
        reset_content = f"""
        ================================================
        🔑 PASSWORD RESET - Numeraxial Platform
        ================================================
        
        To: {email}
        Subject: Reset your Numeraxial password
        
        Hi,
        
        We received a request to reset your password.
        
        Click the link below to set a new password:
        
        {reset_link}
        
        This link will expire in 30 minutes.
        
        If you didn't request this, please ignore the email.
        
        Best regards,
        The Numeraxial Team
        ================================================
        """
        
        print(reset_content)
        logging.info(f"Password reset email sent to {email}")
        return True


# ============================================================
# 🔄 Compatibility wrappers so auth.py can keep using old imports
# ============================================================

async def send_verification_email(email: str, token: str, first_name: str) -> bool:
    return await EmailService.send_verification_email(email, token, first_name)

async def send_welcome_email(email: str, first_name: str) -> bool:
    return await EmailService.send_welcome_email(email, first_name)

async def send_reset_email(email: str, reset_link: str) -> bool:
    return await EmailService.send_password_reset_email(email, reset_link)

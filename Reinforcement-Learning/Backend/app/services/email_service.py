import logging
from typing import Optional
from app.core.settings import get_settings

settings = get_settings()

class EmailService:
    """Email service for sending verification and notification emails"""
    
    @staticmethod
    async def send_verification_email(email: str, token: str, first_name: str) -> bool:
        """
        Send email verification email
        
        Args:
            email: Recipient email address
            token: Verification token
            first_name: User's first name for personalization
            
        Returns:
            bool: True if email sent successfully
        """
        
        # Create verification URL
        verification_url = f"http://localhost:8000/api/auth/verify-email?token={token}&email={email}"
        
        # For development: Log email content to console
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
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        The Numeraxial Team
        
        ================================================
        """
        
        # Print to console (development mode)
        print(email_content)
        logging.info(f"Verification email sent to {email}")
        
        # TODO: Replace with actual email sending
        # For now, return True to simulate successful sending
        return True
    
    @staticmethod
    async def send_welcome_email(email: str, first_name: str) -> bool:
        """
        Send welcome email after successful verification
        
        Args:
            email: User's email address
            first_name: User's first name
            
        Returns:
            bool: True if email sent successfully
        """
        
        welcome_content = f"""
        ================================================
        🎉 WELCOME EMAIL - Numeraxial Platform
        ================================================
        
        To: {email}
        Subject: Welcome to Numeraxial Platform!
        
        Hi {first_name},
        
        Your email has been verified successfully! 🎉
        
        You can now access all features of the Numeraxial Platform:
        
        ✅ AI-powered investment analysis
        ✅ Portfolio optimization tools
        ✅ Reinforcement learning models
        ✅ Professional analytics dashboard
        
        Get started: http://localhost:8000/docs
        
        Happy investing!
        
        Best regards,
        The Numeraxial Team
        
        ================================================
        """
        
        print(welcome_content)
        logging.info(f"Welcome email sent to {email}")
        return True


# For future: Real email implementation examples

class SMTPEmailService:
    """Real SMTP email service (for future use)"""
    
    @staticmethod
    async def send_smtp_email(to_email: str, subject: str, html_content: str) -> bool:
        """
        Send email via SMTP (Gmail, Outlook, etc.)
        
        Example implementation for when you want real emails:
        """
        # Example SMTP implementation
        # import smtplib
        # from email.mime.text import MIMEText
        # from email.mime.multipart import MIMEMultipart
        
        # smtp_server = "smtp.gmail.com"
        # smtp_port = 587
        # sender_email = settings.SMTP_EMAIL
        # sender_password = settings.SMTP_PASSWORD
        
        # message = MIMEMultipart("alternative")
        # message["Subject"] = subject
        # message["From"] = sender_email
        # message["To"] = to_email
        
        # html_part = MIMEText(html_content, "html")
        # message.attach(html_part)
        
        # try:
        #     server = smtplib.SMTP(smtp_server, smtp_port)
        #     server.starttls()
        #     server.login(sender_email, sender_password)
        #     server.sendmail(sender_email, to_email, message.as_string())
        #     server.quit()
        #     return True
        # except Exception as e:
        #     logging.error(f"Failed to send email: {e}")
        #     return False
        
        pass


class SendGridEmailService:
    """SendGrid email service (for production)"""
    
    @staticmethod
    async def send_sendgrid_email(to_email: str, subject: str, html_content: str) -> bool:
        """
        Send email via SendGrid API
        
        Example for production use:
        """
        # Example SendGrid implementation
        # import sendgrid
        # from sendgrid.helpers.mail import Mail
        
        # sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        # message = Mail(
        #     from_email='noreply@numeraxial.com',
        #     to_emails=to_email,
        #     subject=subject,
        #     html_content=html_content
        # )
        
        # try:
        #     response = sg.send(message)
        #     return response.status_code == 202
        # except Exception as e:
        #     logging.error(f"SendGrid error: {e}")
        #     return False
        
        pass
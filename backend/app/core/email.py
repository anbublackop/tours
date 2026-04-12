"""Simple email utility for transactional emails.

If SMTP is not configured (smtp_host is empty), the email is skipped and
the reset URL is printed to the console — useful for local development.
"""
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_reset_email(to_email: str, reset_url: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your YatraSathi password"
    msg["From"] = settings.smtp_from
    msg["To"] = to_email

    text = (
        f"Reset your YatraSathi password\n\n"
        f"Click the link below (expires in 1 hour):\n{reset_url}\n\n"
        f"If you did not request this, you can safely ignore this email."
    )
    html = f"""
    <html>
    <body style="font-family:sans-serif;background:#f4f4f8;padding:32px;">
      <div style="max-width:480px;margin:0 auto;background:#1e2235;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:32px;text-align:center;">
          <h1 style="color:#1e2235;margin:0;font-size:24px;">YatraSathi</h1>
          <p style="color:#1e2235;margin:8px 0 0;opacity:.8;font-size:13px;">Travel &amp; Tours</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#f0e8d8;margin:0 0 12px;">Reset Your Password</h2>
          <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px;">
            We received a request to reset your password. Click the button below —
            this link expires in <strong style="color:#f59e0b;">1 hour</strong>.
          </p>
          <a href="{reset_url}"
             style="display:inline-block;background:#f59e0b;color:#1e2235;padding:14px 32px;
                    border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
            Reset Password
          </a>
          <p style="color:#6b7280;font-size:12px;margin:24px 0 0;line-height:1.5;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password won't be changed.
          </p>
        </div>
      </div>
    </body>
    </html>
    """
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))
    return msg


def send_password_reset_email(to_email: str, token: str) -> None:
    """Send a password-reset email containing a link with the raw token."""
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"

    if not settings.smtp_host:
        # Dev mode — print the link so it can be used without an SMTP server
        separator = "=" * 60
        print(f"\n{separator}")
        print(f"  PASSWORD RESET LINK  (SMTP not configured)")
        print(f"  To : {to_email}")
        print(f"  URL: {reset_url}")
        print(f"{separator}\n")
        return

    msg = _build_reset_email(to_email, reset_url)
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from, to_email, msg.as_string())
        logger.info("Password reset email sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send reset email to %s: %s", to_email, exc)
        # Fall back to console so the developer can still test the flow
        print(f"\n[EMAIL FAILED] Reset URL for {to_email}: {reset_url}\n")

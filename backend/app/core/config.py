from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    app_name: str = "TourBackend"
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    env: str = "development"
    algorithm: str = "HS256"

    # Comma-separated origins in .env, e.g.:
    # ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:8080
    allowed_origins: str = "http://localhost:8080,http://localhost:3000"

    # SMTP — used for password reset emails
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@yatrasathi.com"

    # Base URL of the frontend (used to build password-reset links)
    frontend_url: str = "http://localhost:80"

    # Default admin credentials — seeded automatically on startup
    admin_email: str = "admin@yatrasathi.com"
    admin_password: str = "Admin@YatraSathi2024"
    admin_name: str = "Super Admin"

    @field_validator("secret_key")
    @classmethod
    def secret_key_must_be_strong(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return v

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.env.lower() == "production"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

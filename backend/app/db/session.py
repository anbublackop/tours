from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,      # Detect stale connections before using them
    pool_size=10,            # Persistent connections kept in pool
    max_overflow=20,         # Extra connections allowed under burst load
    pool_timeout=30,         # Seconds to wait for a connection before error
    pool_recycle=1800,       # Recycle connections after 30 min (avoids server-side timeouts)
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

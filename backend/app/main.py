import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy import text

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.api import api_router
from app.db.session import engine
from app.db.base import Base  # noqa: F401 — ensures models are registered


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── startup ──────────────────────────────────────────────────────────────
    setup_logging()
    yield
    # ── shutdown ─────────────────────────────────────────────────────────────
    engine.dispose()


def create_application() -> FastAPI:
    limiter = Limiter(key_func=get_remote_address)

    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        # Hide interactive docs in production
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        openapi_url="/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ── Rate limiter ──────────────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── Middleware ────────────────────────────────────────────────────────────

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        expose_headers=["X-Request-ID"],
    )

    @app.middleware("http")
    async def request_id_middleware(request: Request, call_next):
        """Attach a unique request ID to every request/response for tracing."""
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

    # ── Routers ───────────────────────────────────────────────────────────────

    app.include_router(api_router, prefix="/api/v1")

    # ── Health check ──────────────────────────────────────────────────────────

    @app.get("/health", tags=["health"])
    def health_check():
        """Liveness probe — also tests DB connectivity."""
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return {"status": "ok", "database": "ok"}
        except Exception as exc:
            return JSONResponse(
                status_code=503,
                content={"status": "degraded", "database": str(exc)},
            )

    return app


app = create_application()

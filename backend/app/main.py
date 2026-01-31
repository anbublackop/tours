from app.db.base import Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.logging import setup_logging
from app.db.session import engine

def create_application() -> FastAPI:
    """
    Application factory pattern.
    Helps with testing and scalability.
    """
    setup_logging()

    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # Base.metadata.create_all(bind=engine)

    # -----------------------
    # Middleware
    # -----------------------

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://yourfrontend.com",
            "http://localhost:3000",
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )

    # -----------------------
    # Routers
    # -----------------------

    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health", tags=["health"])
    def health_check():
        return {"status": "ok"}
        
    # -----------------------
    # Startup / Shutdown
    # -----------------------

    @app.on_event("startup")
    async def startup_event():
        # Example: connect to cache, warm up configs
        pass

    @app.on_event("shutdown")
    async def shutdown_event():
        # Example: close DB connections, flush logs
        pass

    return app


app = create_application()



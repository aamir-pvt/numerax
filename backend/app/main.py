from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth
from app.api import portfolio
from app.api import rl_tasks
from app.api import rl_runs
from app.api import data_service

from app.core.settings import get_settings

# Get application settings
settings = get_settings()

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered investment analysis and reinforcement learning platform for professional investors",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend + Swagger UI integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React/Vite dev frontend
        "http://localhost:8080",  # Alternate frontend port
        "http://localhost:8000",  # Swagger UI runs from here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")

app.include_router(rl_tasks.router, prefix="/api")
app.include_router(rl_runs.router, prefix="/api")
app.include_router(data_service.router, prefix="/api/data", tags=["Data Service"])




# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Numeraxial Platform API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "api_prefix": "/api"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "numeraxial-api",
        "database": "connected",
        "authentication": "enabled"
    }

# API status endpoint
@app.get("/api/status")
def api_status():
    return {
        "api_version": "1.0.0",
        "available_endpoints": {
            "authentication": "/api/auth",
            "registration": "/api/auth/register",
            "health": "/api/auth/health"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        }
    }

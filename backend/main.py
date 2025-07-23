from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from backend.routes.dashboard import router as dashboard_router
# from backend.routes.graphs import router as graphs_router
# from backend.routes.pipeline import router as pipeline_router
# from backend.routes.results import router as results_router

from routes.dashboard import router as dashboard_router
from routes.graphs import router as graphs_router
from routes.pipeline import router as pipeline_router
from routes.results import router as results_router

app = FastAPI()

# ✅ Enable CORS to allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (You can change this to specific origins)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# ✅ Include routers WITHOUT prefixes
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(graphs_router, prefix="/graphs", tags=["Graphs"])
app.include_router(pipeline_router, tags=["Pipeline"])
app.include_router(results_router, tags=["Results"])

@app.get("/")
async def home():
    return {"message": "Welcome to the RL Trading Pipeline API"}

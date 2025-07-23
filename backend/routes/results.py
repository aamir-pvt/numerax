from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUNS_DIR = os.path.join(BASE_DIR, "runs")

@router.get("/runs/list")
def list_runs():
    if not os.path.exists(RUNS_DIR):
        return JSONResponse(content={"runs": []}, status_code=200)

    folders = sorted([
        d for d in os.listdir(RUNS_DIR)
        if os.path.isdir(os.path.join(RUNS_DIR, d)) and not d.endswith(".zip")
    ], reverse=True)

    return JSONResponse(content={"runs": folders}, status_code=200)

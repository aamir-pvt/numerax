import os
from fastapi import APIRouter, Response
from fastapi.responses import FileResponse, JSONResponse

# # Custom Response Class
# class CustomResponse(Response):
#     media_type = "application/json"

#     def render(self, content):
#         return super().render(content)

# Use APIRouter with Custom Response
router = APIRouter()

IMAGE_PATH = "examples/logo.png"

# Content for the main screen
MAIN_SCREEN_INFO = {
    "title": "Reinforcement Learning Trading Pipeline",
    "authors": "Tri Cao, Obtin Zandian",
    "description": (
        "The Reinforcement Learning Pipeline is a tool that can be used to study the performance "
        "of different reinforcement learning algorithms on stock trading. The Deep Ensemble "
        "Reinforcement Learning (DERL) model is a combination of multiple reinforcement learning "
        "algorithms, including TD3, A2C, PPO, DDPG, and SAC."
    ),
    "steps": [
        "1. Insert API Key",
        "2. Upload Stock Tickers",
        "3. Select Training Models",
        "4. Select Hyperparameters",
        "5. Select Training and Trading Dates",
        "6. Update Model Config Files",
        "7. Run the Pipeline"
    ]
}

@router.get("/dashboard")
def get_dashboard_info():
    """
    Returns the content that was originally displayed on the Streamlit main screen.
    """
    return MAIN_SCREEN_INFO

@router.get("/logo")
def get_logo():
    """
    Serves the logo image.
    """
    if os.path.exists(IMAGE_PATH):
        return FileResponse(IMAGE_PATH)
    return JSONResponse(content={"error": "Logo not found"}, status_code=404)

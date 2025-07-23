from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAPH_DIR = os.path.join(BASE_DIR, "examples")

# Graph explanations
GRAPHS_INFO = {
    "agents": {
        "description": "Compares the performance of the RL ensemble to the S&P 500 over the trading period. "
                       "Vertical lines represent the validation windows where the agent could be switched.",
        "image": "/graphs/agents_plot"
    },
    "full_comparison": {
        "description": "Compares the RL ensemble to the S&P 500, HRP, and HERC weightings over the trading period.",
        "image": "/graphs/full_comparison_plot"
    },
    "skew": {
        "description": "Shows the skew of the input portfolio, indicating whether the Day-over-Day (DoD) percentage "
                       "changes are positively or negatively skewed.",
        "image": "/graphs/tailDistribution"
    },
    "weights": {
        "description": "Displays the portfolio weights of the RL ensemble over the designated trading period.",
        "image": "/graphs/weights"
    },
    "best_worst_performers": {
        "description": "Shows the top 5 and bottom 5 performing stocks for each validation period based on return "
                       "percentage from average buy price to last price.",
        "image": "/graphs/stock_performance"
    }
}

# Model descriptions
MODELS_INFO = {
    "DDPG": {
        "description": "Deep Deterministic Policy Gradient (DDPG) is an algorithm that learns a Q-function and a policy.",
        "more_info": "https://spinningup.openai.com/en/latest/algorithms/ddpg.html"
    },
    "TD3": {
        "description": "Twin Delayed DDPG (TD3) improves upon DDPG by reducing Q-value overestimation.",
        "more_info": "https://spinningup.openai.com/en/latest/algorithms/td3.html"
    },
    "PPO": {
        "description": "Proximal Policy Optimization (PPO) optimizes policies while preventing drastic updates.",
        "more_info": "https://spinningup.openai.com/en/latest/algorithms/ppo.html"
    },
    "A2C": {
        "description": "Advantage Actor-Critic (A2C) synchronizes multiple agents to stabilize training.",
        "more_info": "https://huggingface.co/blog/deep-rl-a2c"
    },
    "SAC": {
        "description": "Soft Actor-Critic (SAC) optimizes a stochastic policy while maximizing entropy for better exploration.",
        "more_info": "https://spinningup.openai.com/en/latest/algorithms/sac.html"
    }
}

@router.get("/")
def get_graphs():
    """
    Returns descriptions of all available graphs.
    """
    return GRAPHS_INFO


@router.get("/models")
def get_models():
    """
    Returns descriptions of all reinforcement learning models.
    """
    return MODELS_INFO


@router.get("/latest-run")
def get_latest_run_graphs():
    """
    Returns the list of available plots from the most recent run.
    """
    runs_dir = os.path.join(BASE_DIR, "runs")
    if not os.path.exists(runs_dir):
        return {"available": False}

    run_folders = sorted(
        [d for d in os.listdir(runs_dir) if not d.endswith(".zip")],
        reverse=True
    )

    for run in run_folders:
        plot_dir = os.path.join(runs_dir, run, "plots")
        if os.path.exists(plot_dir):
            files = os.listdir(plot_dir)
            plots = {
                "available": True,
                "run": run,
                "plots": {}
            }
            for plot in ["agents_plot.png", "full_comparison_plot.png", "portfolio_weights_pie.png"]:
                if plot in files:
                    plots["plots"][plot.replace(".png", "")] = f"/graphs/latest-run/{plot.replace('.png', '')}"
            return plots

    return {"available": False}


@router.get("/latest-run/{plot_name}")
def get_latest_run_plot_image(plot_name: str):
    """
    Streams the latest run's specific plot by name.
    """
    runs_dir = os.path.join(BASE_DIR, "runs")
    run_folders = sorted(
        [d for d in os.listdir(runs_dir) if not d.endswith(".zip")],
        reverse=True
    )

    for run in run_folders:
        plot_dir = os.path.join(runs_dir, run, "plots")
        candidate_path = os.path.join(plot_dir, f"{plot_name}.png")
        if os.path.exists(candidate_path):
            return FileResponse(candidate_path)

    return JSONResponse(content={"error": "Plot not found"}, status_code=404)


@router.get("/{graph_name}")
def get_graph_image(graph_name: str):
    """
    Serves graph images dynamically.
    """
    graph_file = os.path.join(GRAPH_DIR, f"{graph_name}.png")
    
    if os.path.exists(graph_file):
        return FileResponse(graph_file)
    
    return JSONResponse(content={"error": "Graph not found"}, status_code=404)
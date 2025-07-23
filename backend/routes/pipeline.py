import os
import time
import json
import datetime
import pandas as pd
import shutil
from fastapi.responses import FileResponse
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse
from finrl.plot import backtest_plot, backtest_stats, get_baseline, get_daily_return
from finrl.main import check_and_make_directories
import matplotlib.pyplot as plt
import torch


# from ..run_ensemble import FeatureEngineer, add_covStates, add_interactionEffect, DRL2, loadEOD, INDICATORS, run_backtest, data_split
# from ..get_weights import getModel_portfolioWeighting
# from ..plots import *
# from ..Running_Application import update_configs

# change the below secttion to up commented while using pytest under /backend.
from run_ensemble import FeatureEngineer, add_covStates, add_interactionEffect, DRL2, loadEOD, INDICATORS, run_backtest, data_split
from get_weights import getModel_portfolioWeighting
from plots import plot_portfolio_weights_pie, tailDistribution, get_hrp_hrc
from Running_Application import update_configs

### Constants
plt.style.use("seaborn-v0_8")
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

router = APIRouter()

API_KEY = "678ac301079c27.03780232"
UPLOAD_DIR = "uploads/"
RESULTS_DIR = "results"
ARCHIVE_DIR = "runs"
DATA_FILE = os.path.join(UPLOAD_DIR, "stock_data.csv")
LOG_FILE = os.path.join(RESULTS_DIR, "pipeline_log.txt")

DATA_SAVE_DIR = "datasets"
TRAINED_MODEL_DIR = "trained_models"
TENSORBOARD_LOG_DIR = "tensorboard_logs"

os.makedirs(DATA_SAVE_DIR, exist_ok=True)
os.makedirs(TRAINED_MODEL_DIR, exist_ok=True)
os.makedirs(TENSORBOARD_LOG_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

df = None  # shared global for the pipeline


def log_message(message: str):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w") as f:
            f.write("==== Pipeline Log Start ====\n")

    with open(LOG_FILE, "a") as f:
        log_entry = f"{time.strftime('%Y-%m-%d %H:%M:%S')} - {message}\n"
        f.write(log_entry)
        print(log_entry)



def configs(models=[]):
    """
    Define the Model Kwargs for each model and the number of timesteps for each model
    Parameters:
        - models: list of models to be trained
    Returns:
        - model_kwargs: dictionary with the model kwargs
    """
    ## Define Agents:
    A2C_model_kwargs = (
        {
            "n_steps": 5,
            "ent_coef": 0.005,
            "learning_rate": 0.0007,
            "device": device,
        }
        if "A2C" in models
        else None
    )

    PPO_model_kwargs = (
        {
            "batch_size": 64,
            "learning_rate": 0.00025,
            "ent_coef": 0.005,
        }
        if "PPO" in models
        else None
    )

    DDPG_model_kwargs = (
        {
            # "action_noise":"ornstein_uhlenbeck",
            "buffer_size": 10_000,
            "learning_rate": 0.0005,
            "batch_size": 64,
            "device": device,
        }
        if "DDPG" in models
        else None
    )

    SAC_model_kwargs = (
        {
            "batch_size": 256,
            "buffer_size": 10_000,
            "learning_rate": 0.00003,
            "learning_starts": 100,
            "ent_coef": "auto",
        }
        if "SAC" in models
        else None
    )

    TD3_model_kwargs = (
        {
            "buffer_size": 10_000,
            "learning_rate": 0.0003,
            "batch_size": 256,
            "device": device,
        }
        if "TD3" in models
        else None
    )

    timesteps_dict = {
        "a2c": 10_000 if "A2C" in models else None,
        "ppo": 10_000 if "PPO" in models else None,
        "ddpg": 10_000 if "DDPG" in models else None,
        "sac": 10_000 if "SAC" in models else None,
        "td3": 10_000 if "TD3" in models else None,
    }
    return {
        "A2C_model_kwargs": A2C_model_kwargs,
        "PPO_model_kwargs": PPO_model_kwargs,
        "DDPG_model_kwargs": DDPG_model_kwargs,
        "SAC_model_kwargs": SAC_model_kwargs,
        "TD3_model_kwargs": TD3_model_kwargs,
        "timesteps_dict": timesteps_dict,
    }
    

def update_configs(models=[]):
    """
    ### NOTE: THIS FUNCTION IS USED TO DISPLAY, BUT CHANGES ARE NOT SAVED DUE TO ERRORS WITH
    ### STREAMLIT DATA EDITOR (Very close to working, just need to fix the data types for the columns)
    This Function allows the user to edit the model kwargs for each model
    Parameters:
        - models: list of models to be trained
    Returns:
        - updated_configs: dictionary with the updated model kwargs
    """
    return configs(models)

def populate_weights(saved_dir=RESULTS_DIR):
    summary_path = os.path.join(saved_dir, "summary.csv")

    if not os.path.exists(summary_path):
        log_message(f"❌ summary.csv not found at: {summary_path}")
        return

    try:
        summary = pd.read_csv(summary_path)
    except Exception as e:
        log_message(f"❌ Failed to read summary.csv: {e}")
        return

    try:
        getModel_portfolioWeighting(summary, saved_dir)
        log_message(f"✅ Portfolio weights populated successfully.")
    except FileNotFoundError as e:
        log_message(f"⚠️ Portfolio weighting skipped due to missing file: {e}")
    except Exception as e:
        log_message(f"❌ Error during portfolio weighting: {e}")

def coallate_directories():
    today = datetime.date.today()
    dirs = [
        DATA_SAVE_DIR,
        TRAINED_MODEL_DIR,
        TENSORBOARD_LOG_DIR,
        "plots",
        "weights",
    ]
    os.makedirs(ARCHIVE_DIR, exist_ok=True)

    i = 1
    while os.path.exists(f"{ARCHIVE_DIR}/{today}_{i}"):
        i += 1
    final_path = f"{ARCHIVE_DIR}/{today}_{i}"
    os.makedirs(final_path)

    # Move all standard folders
    for d in dirs:
        if os.path.exists(d):
            shutil.move(d, final_path)
            log_message(f"📦 Moved {d} -> {final_path}/{d}")

    # Handle 'results' folder separately
    if os.path.exists(RESULTS_DIR):
        os.makedirs(os.path.join(final_path, RESULTS_DIR), exist_ok=True)
        for item in os.listdir(RESULTS_DIR):
            item_path = os.path.join(RESULTS_DIR, item)
            if os.path.isfile(item_path) and item == "pipeline_log.txt":
                continue  # keep the log file outside
            shutil.move(item_path, os.path.join(final_path, RESULTS_DIR, item))
            log_message(f"📦 Moved results/{item} -> {final_path}/results/{item}")

    return final_path  # ⚠️ do NOT zip here



@router.post("/upload-tickers")
async def upload_tickers(file: UploadFile = File(...)):
    global df
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file_path)
        else:
            return JSONResponse({"error": "Unsupported file type"}, status_code=400)

        df.to_csv(DATA_FILE, index=False)
        log_message(f"✅ Uploaded file: {file.filename}, {df.shape[0]} rows")
        return {"message": "File uploaded successfully", "rows": df.shape[0]}
    except Exception as e:
        log_message(f"❌ File processing failed: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)

@router.post("/run-pipeline")
async def run_pipeline(
    rebalance_window: int = Form(...),
    validation_window: int = Form(...),
    train_start: str = Form(...),
    train_end: str = Form(...),
    trade_start: str = Form(...),
    trade_end: str = Form(...),
    models: str = Form(...)
):
    global df
    with open(LOG_FILE, "w") as f:
        f.write("==== Pipeline Log Start ====\n")
    
    # os.makedirs("plots", exist_ok=True)
    plt.show()

    if df is None:
        try:
            df = pd.read_csv(DATA_FILE)
        except Exception:
            return JSONResponse({"error": "No dataset uploaded yet."}, status_code=400)
    # Validate form inputs
    try:
        # Parse models
        models = json.loads(models)
        allowed_models = {"A2C", "PPO", "DDPG", "SAC", "TD3"}
        if not models or not all(m in allowed_models for m in models):
            return JSONResponse({"error": "Invalid model selection. Choose from A2C, PPO, DDPG, SAC, TD3."}, status_code=422)

        # Parse dates
        train_start_dt = datetime.datetime.strptime(train_start, "%Y-%m-%d")
        train_end_dt = datetime.datetime.strptime(train_end, "%Y-%m-%d")
        trade_start_dt = datetime.datetime.strptime(trade_start, "%Y-%m-%d")
        trade_end_dt = datetime.datetime.strptime(trade_end, "%Y-%m-%d")

        # Validate date order
        if not (train_start_dt < train_end_dt < trade_start_dt < trade_end_dt):
            return JSONResponse({"error": "Invalid date sequence. Ensure Train Start < Train End < Trade Start < Trade End."}, status_code=422)

        # Validate window values
        if rebalance_window <= 0 or validation_window <= 0:
            return JSONResponse({"error": "Rebalance and validation windows must be positive integers."}, status_code=422)

        trade_days = (trade_end_dt - trade_start_dt).days
        min_required = int(rebalance_window) + int(validation_window)
        if trade_days < min_required:
            log_message(f"⚠️ Trading window is only {trade_days} days — minimum {min_required} required.")
            # not blocking but should be warned

        # Use validated versions moving forward
        train_start = train_start_dt.strftime("%Y-%m-%d")
        train_end = train_end_dt.strftime("%Y-%m-%d")
        trade_start = trade_start_dt.strftime("%Y-%m-%d")
        trade_end = trade_end_dt.strftime("%Y-%m-%d")
    except Exception as e:
        return JSONResponse({"error": f"Validation failed: {str(e)}"}, status_code=422)
    try:
        log_message("🚀 Starting RL pipeline...")
        # models = json.loads(models)

        stock_lst = df["Tickers"].dropna().apply(lambda x: f"{x}.US" if "." not in x else x).tolist()

        # fetch EOD
        df = loadEOD(API_KEY, stock_lst, train_start, trade_end)
        log_message(f"📈 Market data loaded. Shape: {df.shape}, Columns: {df.columns.tolist()}")

        # features
        try:
            fe = FeatureEngineer(
                use_technical_indicator=True,
                tech_indicator_list=INDICATORS,
                use_turbulence=True,
                use_vix=False,
                user_defined_feature=False,
            )
            df = fe.preprocess_data(df)
            df = add_covStates(df)
            log_message("✅ Turbulence and covariance states added successfully.")
        except Exception as e:
            log_message(f"⚠️ Turbulence addition failed: {e}. Retrying with turbulence disabled...")
            
            fe = FeatureEngineer(
                use_technical_indicator=True,
                tech_indicator_list=INDICATORS,
                use_turbulence=False,
                use_vix=False,
                user_defined_feature=False,
            )
            df = fe.preprocess_data(df)
            df = add_covStates(df)  # Still try to add covariance states even without turbulence
            log_message("✅ Retried without turbulence — proceeding without it.")

        df = add_interactionEffect(df)
        df["date"] = pd.to_datetime(df["date"])

        train_data = data_split(df, train_start, train_end)
        trade_data = data_split(df, trade_start, trade_end)

        # parameters
        stock_dim = len(train_data.tic.unique())
        x = INDICATORS.copy()
        for ind in ["cci_30", "dx_30"]:
            if ind in x:
                x.remove(ind)

        tech_indicator_list = x
        state_space = 1 + 2 * stock_dim + len(tech_indicator_list) * stock_dim

        env_kwargs = {
            "hmax": 1000,
            "initial_amount": 1000000,
            "buy_cost_pct": 0.001,
            "sell_cost_pct": 0.001,
            "state_space": state_space,
            "stock_dim": stock_dim,
            "tech_indicator_list": tech_indicator_list,
            "action_space": stock_dim,
            "reward_scaling": 1e-4,
            "print_verbosity": 5,
        }

        # model training
        os.makedirs("runs", exist_ok=True)
        dirs = [DATA_SAVE_DIR, TRAINED_MODEL_DIR, TENSORBOARD_LOG_DIR, RESULTS_DIR]
        check_and_make_directories(dirs)

        model_kwargs = update_configs(models)
        agent = DRL2(
            df=df,
            train_period=(train_start, train_end),
            val_test_period=(trade_start, trade_end),
            rebalance_window=int(rebalance_window),
            validation_window=int(validation_window),
            **env_kwargs
        )

        start = time.time()
        df_summary = agent.run_ensemble_strategy(**model_kwargs)
        training_time = time.time() - start
        log_message(f"✅ Model training complete in {training_time:.2f}s")


        # 🔥 New safe logic: just work with whatever valid CSVs exist
        log_message("🔍 Searching for available 'account_value_trade_ensemble_*.csv' files in results/...")

        available_csvs = sorted(
            [f for f in os.listdir(RESULTS_DIR) if f.startswith("account_value_trade_ensemble_") and f.endswith(".csv")],
            key=lambda f: int(f.split("_")[-1].split(".")[0])
        )

        if not available_csvs:
            log_message("❌ No account_value_trade_ensemble CSV files found in results/. Cannot proceed.")
            return JSONResponse({"error": "No valid account_value_trade_ensemble_*.csv files found."}, status_code=500)

        else:
            for f in available_csvs:
                log_message(f"✅ Found CSV: {f}")

        # backtest
        _, df_account_value = run_backtest(
            TEST_START_DATE=trade_start,
            TEST_END_DATE=trade_end,
            df=df,
            result_csvs=available_csvs,
            rebalance_window=int(rebalance_window),
            validation_window=int(validation_window)
        )

        # saving results
        df_summary.to_csv(os.path.join(RESULTS_DIR, "summary.csv"))
        df_account_value.to_csv(os.path.join(RESULTS_DIR, "account_value.csv"))
        stats = backtest_stats(df_account_value, value_col_name="account_value")
        stats.to_csv(os.path.join(RESULTS_DIR, "stats.csv"))


        try:
            populate_weights(saved_dir=RESULTS_DIR)
        except Exception as e:
            log_message(f"❌ populate_weights failed: {e}")
            
        try:
            plot_portfolio_weights_pie("weights/portfolioWeights.csv", "plots")
            log_message("✅ Portfolio pie chart created.")
        except Exception as e:
            log_message(f"❌ Pie chart generation failed: {e}")


        # === Move final plots into the 'plots' directory ===
        os.makedirs("plots", exist_ok=True)
        try:
            # Move account value plots
            for f in os.listdir(RESULTS_DIR):
                if f.endswith(".png") and "account_value" in f:
                    shutil.move(os.path.join(RESULTS_DIR, f), os.path.join("plots", f))
                    log_message(f"✅ Moved {f} to plots/")

        except Exception as e:
            log_message(f"❌ Plot moving failed: {e}")


        try:
            final_path = coallate_directories()
            shutil.make_archive(final_path, "zip", final_path)
            log_message(f"📦 Finalized results saved to: {final_path}")

        except Exception as e:
            log_message(f"❌ coallate_directories failed: {e}")
            return JSONResponse({"error": str(e)}, status_code=500)


        log_message(f"📦 Finalized results saved to: {final_path}")
        return {
            "status": "success",
            "training_time_sec": round(training_time, 2),
            "run_folder": final_path,
            "summary_file": os.path.join(final_path, "summary.csv"),
        }

    except Exception as e:
        log_message(f"❌ Pipeline failed: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)


@router.get("/logs")
def fetch_logs():
    if os.path.exists(LOG_FILE):
        return StreamingResponse(open(LOG_FILE, "r"), media_type="text/plain")
    return JSONResponse({"error": "No logs found"}, status_code=404)


@router.get("/plot-list")
def get_plot_list():
    all_runs = sorted(os.listdir(ARCHIVE_DIR), reverse=True)

    for run in all_runs:
        if run.endswith(".zip"):
            continue  # skip zip files
        plot_dir = os.path.join(ARCHIVE_DIR, run, "plots")
        if os.path.isdir(plot_dir):
            files = [f for f in os.listdir(plot_dir) if f.endswith(".png")]
            if files:
                return {"run": run, "plots": files}

    log_message("❌ No valid plot directory found under 'runs/'")
    return JSONResponse({"error": "No valid plot directory found."}, status_code=404)


@router.get("/plot-image")
def get_plot_image(run: str, filename: str):
    file_path = os.path.join(ARCHIVE_DIR, run, "plots", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")
    return JSONResponse({"error": "Image not found"}, status_code=404)

@router.get("/download-zip/{filename}")
def download_zip(filename: str):
    zip_path = os.path.join("runs", filename)
    if os.path.exists(zip_path):
        return FileResponse(zip_path, media_type="application/zip", filename=filename)
    return JSONResponse({"error": "File not found"}, status_code=404)
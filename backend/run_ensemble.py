## Import

import datetime
import os
import shutil
import sys
import time
from pprint import pprint

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import riskfolio as rp
import torch
import yfinance as yf
from eod import EodHistoricalData
from finrl.agents.stablebaselines3.models import DRLAgent, DRLEnsembleAgent
from finrl.config import (
    DATA_SAVE_DIR,
    INDICATORS,
    RESULTS_DIR,
    TENSORBOARD_LOG_DIR,
    TRAINED_MODEL_DIR,
)
from finrl.main import check_and_make_directories
from finrl.meta.data_processor import DataProcessor
from finrl.meta.env_stock_trading.env_stocktrading import StockTradingEnv
from finrl.meta.preprocessor.preprocessors import FeatureEngineer, data_split
from finrl.meta.preprocessor.yahoodownloader import YahooDownloader
from finrl.plot import backtest_plot, backtest_stats, get_baseline, get_daily_return
from stable_baselines3.common.logger import configure
from tqdm import tqdm

from custom_ensemble import DRLEnsembleAgent as DRL2

### Constants
plt.style.use("seaborn-v0_8")
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")


## Data Preprocessing functions:
def loadEOD(api_key, stock_lst, start_date, end_date):
    """
    Load EOD data for a list of stocks

    Input:
     - api_key: str, api key for EOD
     - stock_lst: list of str, list of stock tickers with '.US' at the end
     - start_date: str, start date for the data
     - end_date: str, end date for the data

    Output:
     - df: pd.DataFrame, dataframe with EOD data for the stocks
    """

    client = EodHistoricalData(api_key)
    df = pd.DataFrame()
    for stock in stock_lst:
        try:
            resp = client.get_prices_eod(
                stock, period="d", order="a", from_=start_date, to=end_date
            )
            resp = pd.DataFrame(resp)
            resp["tic"] = stock
            resp["day"] = resp.index
            df = pd.concat([df, resp])
        except Exception as e:
            print(f"Error downloading {stock}", e)
    df.sort_values(["date", "tic"], inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df


def add_covStates(df):
    """
    Adds covariance states to the preprocessed dataframe.

    Input:
    - df: preprocessed dataframe from finrl FeatureEngineer class.

    Output:
    - df: preprocessed dataframe with covariance states added.
    """
    df = df.sort_values(["date", "tic"], ignore_index=True)
    df.index = df.date.factorize()[0]
    cov_list = []
    return_list = []
    # look back is one year
    lookback = 252
    for i in range(lookback, len(df.index.unique())):
        data_lookback = df.loc[i - lookback : i, :]
        price_lookback = data_lookback.pivot_table(
            index="date", columns="tic", values="close"
        )
        return_lookback = price_lookback.pct_change().dropna()
        return_list.append(return_lookback)

        covs = return_lookback.cov().values
        cov_list.append(covs)

    df_cov = pd.DataFrame(
        {
            "date": df.date.unique()[lookback:],
            "cov_list": cov_list,
            "return_list": return_list,
        }
    )
    df = df.merge(df_cov, on="date")
    df = df.sort_values(["date", "tic"]).reset_index(drop=True)
    return df


def add_interactionEffect(df):
    """
    Function for adding all siginifiant interaction efffects for RL training.

    Input:
     - df: preprocessed dataframe from finrl FeatureEngineer class.

    Output:
     - df: preprocessed dataframe with interaction effects added.
    """

    df["close_macd_interaction"] = df.close * df.macd
    df["bollU_bollL_interaction"] = df.boll_ub * df.boll_lb
    df["bollU_30sma_interaction"] = df.boll_ub * df.close_30_sma
    df["bollL_30sma_interaction"] = df.boll_lb * df.close_30_sma
    df["30rsi_60sma_interaction"] = df.rsi_30 * df.close_60_sma

    return df


## Plotting Functions
def run_backtest(
    TEST_START_DATE,
    TEST_END_DATE,
    df,
    result_csvs,
    RESULTS_DIR=RESULTS_DIR,
    rebalance_window=63,
    validation_window=63,
):
    """
    Runs backtest and gets sharpe ratio for Rl ensemble over testing period.

    Input:
     - TEST_START_DATE: str, start date for testing
     - TEST_END_DATE: str, end date for testing
     - df: pd.DataFrame, preprocessed dataframe
     - RESULTS_DIR: str, directory for results
     - rebalance_window: int, number of days before retraining the model
     - validation_window: int, number of days before deciding to switch agents

    Output:
     - sharpe: float, sharpe ratio of the backtest
    """
    unique_trade_date = df[
        (df.date > TEST_START_DATE) & (df.date <= TEST_END_DATE)
    ].date.unique()

    df_trade_date = pd.DataFrame({"datadate": unique_trade_date})

    df_account_value = pd.DataFrame()
    for fname in result_csvs:
        temp = pd.read_csv(os.path.join(RESULTS_DIR, fname))
        df_account_value = pd.concat([df_account_value, temp], ignore_index=True)
    sharpe = (
        (252**0.5)
        * df_account_value.account_value.pct_change(1).mean()
        / df_account_value.account_value.pct_change(1).std()
    )
    print("Sharpe Ratio: ", sharpe)
    df_account_value = df_account_value.join(
        df_trade_date[validation_window:].reset_index(drop=True)
    )

    return sharpe, df_account_value


def plot_fullComparison(plot_dict, initial_value=1_000_000):
    """
    Make a plot of RL vs HRP vs HERC, all compared to SPY.

    Input:
     - plot_dict = Python dictionary containing the cumulative returns of the portfolio over the defined time period
           - Keys = names of models (ex. "RL", "HRP", "HRC")
           - Values = lists/arrays of cumulative returns (ensure all are the same length!)

    Output:
     - None
    """

    _, _ = plt.subplots(figsize=(12, 8))
    hercPlot = []
    for i in range(len(plot_dict["RL"])):
        hercPlot.append(plot_dict["HERC"][i] * initial_value)
    hrpPlot = []
    for i in range(len(plot_dict["RL"])):
        hrpPlot.append(plot_dict["HRP"][i] * initial_value)

    plot_dict["RL"].account_value.plot(label="RL Ensemble", c="blue", alpha=0.5)
    plot_dict["SPY"].account_value.plot(label="S&P 500", c="red", alpha=0.5)
    plt.plot(
        plot_dict["RL"].index, hrpPlot, color="green", alpha=0.5, label="HRP Weighting"
    )
    plt.plot(
        plot_dict["RL"].index,
        hercPlot,
        color="brown",
        alpha=0.5,
        label="HERC Weighting",
    )
    plt.legend()
    # plt.show()
    outPath = "plots"
    # Create the date subdirectory if it doesn't exist
    os.makedirs(outPath, exist_ok=True)
    outPath += "/full_comparison_plot"
    plt.savefig(outPath)


def plot_allAgents(
    df_account_value, df_sp500, df_summary, rebalance_window, validation_window
):
    """
    Take a dictionary for the RL ensemble, and plot the validation windows for each agent

    Input:
     - df_account_value = cumulative returns of the RL ensemble.
     - df_sp500 = cumulative returns of the S&P 500.
     - df_summary = summary of the RL ensemble.
     - rebalance_window = number of days between re-training.
     - validation_window = number of days between validation periods.

    Output:
     - None --> Model is saved to "plots" directory, under the subdirectory of todays date.
    """
    model_color_dct = {
        "a2c": "blue",
        "ddpg": "green",
        "ppo": "red",
        "sac": "orange",
        "td3": "magenta",
    }

    _, ax = plt.subplots(figsize=(12, 8))
    df_account_value.account_value.plot(label="Portfolio Value", c="blue", alpha=0.5)
    df_sp500.account_value.plot(label="S&P 500", c="red", alpha=0.5)

    # plot lines where sac and a2c models are trained
    ylim = [
        0.99 * min(df_account_value.account_value.min(), df_sp500.account_value.min()),
        1.05 * max(df_account_value.account_value.max(), df_sp500.account_value.max()),
    ]

    ax.set_ylim(ylim)
    for i in range(len(df_account_value)):
        if i % rebalance_window == 0:
            ax.axvline(i, color="k", linestyle="--")
            color = model_color_dct[
                df_summary.loc[i // rebalance_window, "Model Used"].lower()
            ]
            ax.axvspan(i, i + validation_window, color=color, alpha=0.1)
            ax.text(
                i + validation_window - 20,
                ylim[1] * 0.99,
                df_summary.loc[i // rebalance_window, "Model Used"],
                color=color,
            )

    plt.title("Portfolio Value vs S&P 500")
    plt.legend(loc="lower right")
    # Change x-axis to dates

    outPath = "plots"
    # Create the date subdirectory if it doesn't exist
    os.makedirs(outPath, exist_ok=True)
    plt.savefig(outPath + "/agents_plot")  # Fix the path
    # save csv
    df_account_value.to_csv(outPath + "/av.csv")
    df_sp500.to_csv(outPath + "/sp500.csv")

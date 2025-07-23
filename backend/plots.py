import datetime
import os

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pyfolio
import riskfolio as rp
import seaborn as sns

# import yfinance as yf
# from eod import EodHistoricalData
# from finrl.config_tickers import SP_500_TICKER


def tailDistribution(eodData):
    """
    Creates a tail distribution plot for the given portfolio.
    Allows user to determine if the portfolio DoD % chance is postiively or negatively skewed.
    Assumes portfolio weights are equally distributed.

    Input:
     - tickers = Python list of all tickers in the protfolio
     - TRAIN_START_DATE = Start date of the training period
     - TEST_END_DATE = End date of the testing period
     - rf = Risk free rate, default = 5.2%
    """
    ## Code fix

    newData = pd.DataFrame(
        columns=eodData.tic.unique(), index=eodData.date.unique(), data=0
    )  # Create dataframe filled with 0s
    for c in newData:
        # Filter the data for the current "tic" value
        tic_data = eodData[eodData["tic"] == c]
        # Create a series with "date" as index and "adjusted_close" as values
        series = pd.Series(tic_data["close"].values, index=tic_data["date"])
        series = series.pct_change()
        newData[c] = series
    Y = newData.iloc[1:, :]
    Y = Y.dropna(axis=1)
    df = pd.DataFrame(data=1 / len(Y.columns), columns=["weights"], index=Y.columns)

    fig, ax = plt.subplots(figsize=(10, 6))
    # print(Y.shape)
    rp.plot_range(returns=Y, w=df / 100, alpha=0.05, height=6, width=10, ax=ax)

    outPath = "plots"
    # Create the date subdirectory if it doesn't exist
    os.makedirs(outPath, exist_ok=True)
    outPath += "/tailDistribution"
    plt.savefig(outPath)  # Fix the path


def get_hrp_hrc(eodData, rf=0.052):
    """
    Computes the HRP and HRC weighting for a given list of stocks

    Input:
     - tickers = Python list of all tickers in the protfolio
     - TRAIN_START_DATE = Start date of the training period
     - TEST_END_DATE = End date of the testing period
     - rf = Risk free rate, default = 5.2%

    Output:
     - output = dictionary containing two keys (HRP and HRC) with the cumulative returns of the portfolio over the defined time period
    """

    # yfinance for industry portfolio
    pd.options.display.float_format = "{:.4%}".format

    # Downloading data
    newData = pd.DataFrame(
        columns=eodData.tic.unique(), index=eodData.date.unique(), data=0
    )  # Create dataframe filled with 0s
    for c in newData:
        # Filter the data for the current "tic" value
        tic_data = eodData[eodData["tic"] == c]
        # Create a series with "date" as index and "adjusted_close" as values
        series = pd.Series(tic_data["close"].values, index=tic_data["date"])
        series = series.pct_change()
        newData[c] = series
    Y = newData.iloc[1:, :]
    Y = Y.dropna(axis=1)

    ## Starting to calcualte weights
    models = ["HRP", "HERC"]
    codependence = "pearson"  # Correlation matrix used to group assets in clusters
    rm = "MV"  # Risk measure used, this time will be variance
    linkage = "ward"  # Linkage method used to build clusters
    leaf_order = True  # Consider optimal order of leafs in dendrogram
    k = 5
    output = {}

    for model in models:
        port = rp.HCPortfolio(returns=Y)
        w = port.optimization(
            model=model,
            codependence=codependence,
            rm=rm,
            rf=rf,
            linkage=linkage,
            max_k=k,
            leaf_order=leaf_order,
        )
        # w.to_csv(f"""{model}_weights""")
        w_dict = {k: v for k, v in zip(Y.columns, w.T.values[0])}
        outCopy = Y.copy()
        dfMul = outCopy.mul(w_dict, axis=1)
        dfMul = dfMul.sum(axis=1)
        ml_cumProd = (dfMul + 1).cumprod()  # Turn daily returns into cumulative returns
        output[model] = ml_cumProd

    return output


def plot_portfolio_weights_pie(weights_path="weights/portfolioWeights.csv", out_dir="plots"):
    """
    Generates a pie chart from the portfolioWeights.csv file.
    """
    try:
        df = pd.read_csv(weights_path, index_col=0)
        df = df.drop(columns=["date"], errors="ignore")
        weights = df.iloc[-1]  # use last row
        weights = weights[weights > 0].sort_values(ascending=False)

        fig, ax = plt.subplots(figsize=(8, 6))
        ax.pie(weights, labels=weights.index, autopct='%1.1f%%', startangle=140)
        ax.set_title("Final Portfolio Weights")

        os.makedirs(out_dir, exist_ok=True)
        save_path = os.path.join(out_dir, "portfolio_weights_pie.png")
        plt.tight_layout()
        plt.savefig(save_path)
        plt.close()
        print(f"✅ Saved portfolio weights pie chart at: {save_path}")
    except Exception as e:
        print(f"❌ Failed to generate pie chart: {e}")


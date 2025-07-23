import datetime
import os

import pandas as pd
from eod import EodHistoricalData


def getModel_portfolioWeighting(
    df_summary: pd.DataFrame, saved_dir="/results"
) -> pd.DataFrame:
    """
    Traces through output of a trained RL ensemble to return final portfolio weights per asset.

    Input:
     - df_summary: output of ensemble agents 'run_ensemble_strategy' method. (pd.DataFrame,)
     - results_dir: path of saved results output by ensemble agent.. (str)

    Output:
     - df_portfolioWeights: portfolio weights per asset. (pd.DataFrame,)
      Columns = Ticker, Value = Weight % as defined by RL ensemble
    """

    ## Create filename for each row and load that file
    baseAction_fileName = saved_dir + "/actions_validation"
    totalInvested = 0

    sampleFile = (
        baseAction_fileName
        + f"""_{df_summary.loc[0 ,"Model Used"]}_{df_summary.loc[0 ,"Iter"]}.csv"""
    )
    sample = pd.read_csv(sampleFile)
    output = pd.DataFrame(
        columns=sample.columns, data={k: 0 for k in sample.columns}, index=[0]
    )
    print(output)

    ## Above is working, creates blank df with 1 row, cols = ticker, all vals = 0

    totalInvested = 0
    for i in df_summary.index:  # Row per validation period
        appender = (
            f"""_{df_summary.loc[i ,"Model Used"]}_{df_summary.loc[i ,"Iter"]}.csv"""
        )
        thisFile = baseAction_fileName + appender

        ## Load data for this validation period
        df_actions = pd.read_csv(thisFile)
        df_actions = df_actions.set_index("date")
        df_actions.head()
        ## Vertical sum each col, divide by total portfolio val to get weight
        vertSum = df_actions.sum(axis=0)
        output = vertSum + output

        totalInvested += vertSum.sum()
        if i == df_summary.index[-1]:
            output = output / totalInvested
        outPath = "weights"
        os.makedirs(
            outPath, exist_ok=True
        )  # Creates subdirectory for todays date in results
        outPath = outPath + "/portfolioWeights.csv"
        output.to_csv(outPath)

        print(
            "Weights successfully saved to the path: ",
            saved_dir + "/portfolioWeights.csv",
        )

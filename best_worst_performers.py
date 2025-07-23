import os

import numpy as np
import pandas as pd
from matplotlib import pyplot as plt


def plot_stock_performance(df_summary, eodData, RESULTS_DIR):
    """
    Plots the top 5 and bottom 5 performing stocks for each validation period.
    Performance is calculated as the return percentage from the average buy price to the last price of that stock in the trading period.
    Average buy price is calculated as the weighted average of the buy prices, starting from the date of the first buy.
    Thus, each trade will either increase or decrease that average buy price, and the final returns are calculated using that average buy price of the time period

    Input:
     - df_summary: output of ensemble agents 'run_ensemble_strategy' method. Lists the model used and iteration number.
     - eodData: pd.DataFrame, dataframe with EOD data for the stocks
     - RESULTS_DIR: directory where the results are saved that will be used by this plotting function

    Output:
     - None --> Plots are saved into "plots" directory automatically
    """

    ## Data preprocessing to be used for calcualtions
    newData = pd.DataFrame(
        columns=eodData.tic.unique(), index=eodData.date.unique(), data=0
    )  # Create dataframe filled with 0s
    for c in newData:
        # Filter the data for the current "tic" value
        tic_data = eodData[eodData["tic"] == c]
        # Create a series with "date" as index and "adjusted_close" as values
        series = pd.Series(tic_data["close"].values, index=tic_data["date"])
        newData[c] = series

    baseAction_fileName = RESULTS_DIR + "/actions_validation"

    ## Looping through each extra file is done
    plotCounter = 0
    fileMap = {}

    for i in df_summary.index:  # Row per validation period
        returnMap = {}
        appender = f"""_{df_summary.loc[i ,"Model Used"].lower()}_{df_summary.loc[i ,"Iter"]}.csv"""
        thisFile = baseAction_fileName + appender
        ## Load data for this validation period
        df_actions = pd.read_csv(thisFile)
        # plot_dirName = f"""{df_summary.loc[i ,"Model Used"]}_window{plotCounter}"""
        df_actions = df_actions.set_index("date")
        for stock in df_actions.columns:  # Loop through each stock
            col_shareTrack = []
            total_shareTrack = 0
            avg_price = 0
            for day in df_actions.index:  # check each row if theres a buy or not

                ## if a buy today, append the num shares and price
                buyAppender = (
                    df_actions[stock][day],
                    newData[stock][day],
                    day,
                )  # (numShares, stockPrice)
                # print(buyAppender)

                if buyAppender[0] != 0:  # If bought shares this day
                    col_shareTrack.append(buyAppender)
                    # boolean_firstBuy = True  # Change variable to true to indicate that a buy has now been made
                    if buyAppender[0] > 0:
                        total_shareTrack += buyAppender[0]

            ## All days have been checked for this stock
            if total_shareTrack != 0:
                numerator1 = sum([x[0] * x[1] for x in col_shareTrack if x[0] > 0])
                numerator2 = sum([x[0] + [1] for x in col_shareTrack if x[0] < 0])
                avg_price = (numerator1 + numerator2) / total_shareTrack

            ## Calculate the return using average buy price, and last day of holding stock as final price
            if len(col_shareTrack) > 0:
                lastPrice = newData[stock][col_shareTrack[-1][2]]
                return_pct = (lastPrice - avg_price) / avg_price
                returnMap[stock] = return_pct
            fileMap[thisFile] = returnMap

    # Iterate over the keys in fileMap for plotting
    for key in fileMap.keys():
        # Get the singular values of the array for the current key
        thisDict = fileMap[key]
        y = list(thisDict.values())
        x = list(thisDict.keys())
        y = [v[0] if isinstance(v, np.ndarray) else v for v in y]

        ## Get only top 5 and bottom 5 performing stocks
        sorted_data = sorted(zip(y, x))
        sorted_y, sorted_x = zip(*sorted_data)
        finalY = sorted_y[:5] + sorted_y[-5:]
        finalX = sorted_x[:5] + sorted_x[-5:]

        my_cmap = plt.get_cmap("viridis")
        rescale = lambda y: (y - np.min(y)) / (np.max(y) - np.min(y))
        _, ax = plt.subplots(figsize=(15, 7))
        ax.bar(finalX, finalY, color=my_cmap(rescale(finalY)))
        titlePlot = (
            key.split("/")[-1].split("_")[2]
            + " "
            + key.split("/")[-1].split("_")[3].split(".")[0]
        )
        plt.title(f"Trading Results for {titlePlot}")
        plt.ylabel("Return %")
        outPath = "plots"
        # Create the date subdirectory if it doesn't exist
        os.makedirs(outPath, exist_ok=True)
        outPath += f"/best_worst_performers_{titlePlot}.png"
        plt.savefig(outPath)  # Fix the path

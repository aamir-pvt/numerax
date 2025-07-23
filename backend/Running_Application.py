import json

import streamlit as st

from best_worst_performers import *
from get_weights import *
from plots import *
from run_ensemble import *

sys.path.append("..")


def app():
    """
    The main function for the streamlit application
    """
    st.title("Reinforcement Learning Pipeline")

    st.markdown("***")
    api_key = st.text_input("Insert API Key", type="password")

    st.header("Upload the Stock Tickers")
    # Get input Data
    st.write(
        "Insert Data, either CSV or Excel file. Stock ticker should be in the first column. Example: 'AAPL.US' for Apple Inc."
    )
    input_data = st.file_uploader("Upload Data", type=["csv", "xlsx"])
    if input_data is not None:
        try:
            stock_lst = get_tickers(input_data)
            st.write("Stock Tickers:\n\n", ", ".join(stock_lst))
        except Exception as e:
            st.write(e)
    else:
        st.write("Please upload a file.")

    st.header("Select Training Models")
    accepted_models = ["A2C", "PPO", "DDPG", "SAC", "TD3"]
    models = st.multiselect(
        "We Reccomend All Except PPO Due to Training Time.\n See [Model Information](/Model_Information) for More Details.",
        accepted_models,
    )
    models.sort(key=lambda x: accepted_models.index(x))
    # Update the model kwargs
    model_kwargs = update_configs(models)

    # Update Environment Parameters
    st.markdown("***")
    st.header("Select the Hyperparameters")
    hp1, hp2, hp3, hp4 = st.columns([1, 1, 1, 1])
    with hp1:
        st.write("Initialize the Account Value")
        # input a number between 0 and 100
        hp1 = st.number_input(
            "Inital Account Value $ (USD)", min_value=1, max_value=None, value=1000000
        )
    with hp2:
        st.write("Maximum Number of Shares")
        hp2 = st.number_input("Max Shares", min_value=1, max_value=None, value=1000)
    with hp3:
        st.write("Rebalance Window")
        hp3 = st.number_input("Rebalance Window", min_value=1, max_value=None, value=20)
    with hp4:
        st.write("Validation Window")
        hp4 = st.number_input(
            "Validation Window", min_value=1, max_value=None, value=20
        )
    hp_kwargs = {
        "account_value": hp1,
        "hmax": hp2,
        "rebalance_window": hp3,
        "validation_window": hp4,
    }

    st.markdown("***")

    st.header("Select the Training and Trading Dates")
    # Use a calendar to select the start and end date
    st.write("Select the start and end date for the training period")
    train_date1, train_date2 = st.columns(2)
    START_DATE = pd.to_datetime("1990-01-01")
    TODAY = pd.to_datetime("today")
    with train_date1:
        train_start = st.date_input(
            "Training Start Date",
            value=TODAY - pd.DateOffset(years=15),
            min_value=START_DATE,
            max_value=TODAY - pd.DateOffset(days=3 * hp4),
        )
    with train_date2:
        train_end = st.date_input(
            "Training End Date",
            value=TODAY - pd.DateOffset(days=4 * hp4),
            min_value=(train_start + pd.DateOffset(days=3 * hp4)),
            max_value=TODAY - pd.DateOffset(days=3 * hp4),
        )

    st.write("Select the start and end date for the trading period")
    trade_date1, trade_date2 = st.columns(2)
    with trade_date1:
        trade_start = st.date_input(
            "Trading Start Date",
            value=train_end + pd.DateOffset(days=hp4),
            min_value=train_end + pd.DateOffset(days=hp4),
            max_value=TODAY - pd.DateOffset(days=3 * hp4),
        )
    with trade_date2:
        trade_end = st.date_input(
            "Trading End Date",
            value=trade_start + pd.DateOffset(days=2 * hp4),
            min_value=trade_start + pd.DateOffset(days=2 * hp4),
            max_value=TODAY,
        )
    date_kwargs = {
        "train_start": train_start,
        "train_end": train_end,
        "trade_start": trade_start,
        "trade_end": trade_end,
    }

    st.markdown("***")
    # Run the pipeline with a button
    if st.button("Run Pipeline"):
        st.write("Pipeline is running...")
        run_ensemble(
            stock_lst,
            api_key,
            hp_kwargs,
            date_kwargs,
            model_kwargs,
        )


def get_tickers(file):
    """
    This function reads a file and returns a formatted list of stock tickers
    Parameters:
        - file: file object
    Returns:
        - stock_lst: list of stock tickers
    """
    if file.name.endswith(".csv"):
        data = pd.read_csv(file, header=0)
    elif file.name.endswith(".xlsx"):
        data = pd.read_excel(file, header=0)
    tickers = data["Tickers"]
    tickers.dropna(inplace=True)
    tickers.replace("\xa0", "", regex=True, inplace=True)
    stock_lst = [f"{ticker}.US" if "." not in ticker else ticker for ticker in tickers]
    return stock_lst


def populate_weights(saved_dir=RESULTS_DIR):
    """
    This function populates the weights directory with the portfolio weights
    Parameters:
        - saved_dir: directory where the results are saved

    Returns:
        - None
    """
    ## Load in the results of the ensemble agent
    summary = pd.read_csv(saved_dir + "/summary.csv")
    getModel_portfolioWeighting(summary, saved_dir)
    return None


def coallate_directories():
    """
    This function moves the directories into a new directory with today's date and a run number
    """
    today = datetime.date.today()
    dirs = [
        DATA_SAVE_DIR,
        TRAINED_MODEL_DIR,
        TENSORBOARD_LOG_DIR,
        RESULTS_DIR,
        "plots",
        "weights",
    ]
    if not os.path.exists("runs"):
        os.makedirs("runs")

    # add a _1, _2, _3, etc. to the end of the directory
    i = 1
    while os.path.exists(f"runs/{today}_{i}"):
        i += 1
    final_path = f"runs/{today}_{i}"
    os.makedirs(final_path)

    # Move Directories into one with today's date and run number
    for d in dirs:
        if os.path.exists(d):
            shutil.move(d, final_path)
    shutil.make_archive(f"{final_path}/archive", "zip", f"{final_path}/archive")
    return final_path


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
    # Create a JSON object
    config = configs(models)
    original_kwargs = [config[k] for k in config if k != "timesteps_dict" and config[k]]
    original_timesteps = config["timesteps_dict"]
    timesteps = pd.Series(original_timesteps.values()).dropna()
    # Convert the JSON object to a dataframe
    df = pd.DataFrame(original_kwargs, index=models)
    # df.drop(columns=["buffer_size"], inplace=True)
    df["timesteps"] = timesteps.values
    # Allow the user to edit the dataframe
    edited_df = st.data_editor(df)

    timesteps_dict = edited_df["timesteps"].dropna().to_dict()
    # Change key to model name
    timesteps_dict = {
        k.lower(): int(v) for k, v in zip(models, timesteps_dict.values())
    }
    edited_df.drop(columns=["timesteps"], inplace=True)
    # Convert datatypes to ints if possible otherwise convert to floats and replace , with _
    edited_df = edited_df.applymap(
        lambda x: (
            int(x)
            if isinstance(x, (int, str, float)) and str(x).replace(",", "").isdigit()
            else (
                float(x)
                if isinstance(x, (float, str)) and str(x).__contains__(".")
                else x
            )
        )
    )
    updated_configs = {
        "A2C_model_kwargs": (
            edited_df.loc["A2C"].dropna().to_dict() if "A2C" in models else None
        ),
        "PPO_model_kwargs": (
            edited_df.loc["PPO"].dropna().to_dict() if "PPO" in models else None
        ),
        "DDPG_model_kwargs": (
            edited_df.loc["DDPG"].dropna().to_dict() if "DDPG" in models else None
        ),
        "SAC_model_kwargs": (
            edited_df.loc["SAC"].dropna().to_dict() if "SAC" in models else None
        ),
        "TD3_model_kwargs": (
            edited_df.loc["TD3"].dropna().to_dict() if "TD3" in models else None
        ),
        "timesteps_dict": timesteps_dict,
    }
    # return updated_configs # Uncomment this line to use the data editor
    return config


def run_ensemble(stock_lst, api_key, hp_kwargs, date_kwargs, model_kwargs):
    """
    Run the ensemble strategy
    Parameters:
        - stock_lst: list of stock tickers
        - api_key: API Key for the data source
        - hp_kwargs: hyperparameters
        - date_kwargs: dictionary with the training and trading dates
        - model_kwargs: dictionary with the model kwargs
    Returns
        - None
    """

    TRAIN_START_DATE = date_kwargs["train_start"].strftime("%Y-%m-%d")
    TRAIN_END_DATE = date_kwargs["train_end"].strftime("%Y-%m-%d")
    TEST_START_DATE = date_kwargs["trade_start"].strftime("%Y-%m-%d")
    TEST_END_DATE = date_kwargs["trade_end"].strftime("%Y-%m-%d")

    """ ------ Data Loading ------ """
    ### If you don't want to use EOD, then you can use the data pulled from the database here. ###
    start_time = time.time()
    try:
        df = loadEOD(
            api_key, stock_lst, TRAIN_START_DATE, TEST_END_DATE
        )  # Change this line if you want other data sources besides EOD
        df = df[["date", "tic", "close"]]
        tailDistribution(df)
        st.image("plots/tailDistribution.png", caption="Day over Day Skew Histogram")

        st.write(
            "Data Loaded Successfully! Time taken: ",
            time.time() - start_time,
            " seconds",
        )
    ### ----------------- ###
    except Exception as e:
        st.write("Data Loading Failed. Please check your API key and try again.")
        st.write(e)
        return

    """ ------ Data Preprocessing ------ """
    start_time = time.time()
    try:
        x = INDICATORS.copy()
        x.remove("cci_30")
        x.remove("dx_30")
        fe = FeatureEngineer(
            use_technical_indicator=True,
            tech_indicator_list=x,
            use_turbulence=True,
            use_vix=False,
            user_defined_feature=False,
        )
        df = fe.preprocess_data(df)

        df = add_covStates(df)
        df = add_interactionEffect(df)
        st.write(
            "Data Preprocessed Successfully! Time taken: ",
            time.time() - start_time,
            " seconds",
        )
    except Exception as e:
        st.write("Data Preprocessing Failed.")
        st.write(e)
        return

    """ ------ Model Setup ------ """

    start_time = time.time()
    try:
        dirs = [DATA_SAVE_DIR, TRAINED_MODEL_DIR, TENSORBOARD_LOG_DIR, RESULTS_DIR]
        # Delete the directories if they exist
        for d in dirs:
            if os.path.exists(d):
                shutil.rmtree(d)
        # Make the directories
        check_and_make_directories(dirs)
        train = data_split(df, TRAIN_START_DATE, TRAIN_END_DATE)
        trade = data_split(df, TEST_START_DATE, TEST_END_DATE)

        stock_dimension = len(train.tic.unique())
        state_space = 1 + 2 * stock_dimension + len(x) * stock_dimension

        env_kwargs = {
            "hmax": hp_kwargs["hmax"],
            "initial_amount": hp_kwargs["account_value"],
            "buy_cost_pct": 0.001,
            "sell_cost_pct": 0.001,
            "state_space": state_space,
            "stock_dim": stock_dimension,
            "tech_indicator_list": x,
            "action_space": stock_dimension,
            "reward_scaling": 1e-4,
            "print_verbosity": 5,
        }  # Change any of the hyperparameters here if needed

        ensemble_agent = DRL2(
            df=df,
            train_period=(TRAIN_START_DATE, TRAIN_END_DATE),
            val_test_period=(TEST_START_DATE, TEST_END_DATE),
            rebalance_window=hp_kwargs["rebalance_window"],
            validation_window=hp_kwargs["validation_window"],
            **env_kwargs,
        )
        st.write(
            "Model Setup Complete! Time taken: ", time.time() - start_time, " seconds"
        )
    except Exception as e:
        st.write("Model Setup Failed.")
        st.write(e)
        return

    """ ------ Run Ensemble Model (Takes Significant time, Check Console) ------ """

    start_time = time.time()
    # Save model kwargs to a file
    with open(f"{RESULTS_DIR}/model_kwargs.json", "w") as f:
        # Replace device with the string representation
        to_json = model_kwargs.copy()
        for k in to_json:
            if to_json[k] and "device" in to_json[k]:
                to_json[k]["device"] = str(to_json[k]["device"])
        to_json["Train_Start_Date"] = TRAIN_START_DATE
        to_json["Train_End_Date"] = TRAIN_END_DATE
        to_json["Test_Start_Date"] = TEST_START_DATE
        to_json["Test_End_Date"] = TEST_END_DATE
        json.dump(to_json, f)

    try:
        df_summary = ensemble_agent.run_ensemble_strategy(**model_kwargs)
        st.write(
            "Training Models Complete! Time taken: ",
            time.time() - start_time,
            " seconds",
        )
    except Exception as e:
        st.write("Training Models Failed.")
        st.write(e)
        return

    """ ------ Evaluating Models ------ """
    start_time = time.time()
    try:
        ## Output backtest sharpe ratio and save summary of resuslts:
        _, df_account_value = run_backtest(
            TEST_START_DATE,
            TEST_END_DATE,
            df,
            rebalance_window=hp_kwargs["rebalance_window"],
            validation_window=hp_kwargs["validation_window"],
        )
        saveDir = f"{RESULTS_DIR}/summary.csv"
        df_summary.to_csv(saveDir)
        # Save the dataframes to csv files
        df_summary.to_csv("datasets/summary.csv")
        df_account_value.to_csv("datasets/account_value.csv")

        st.write(
            "Evaluating Models Complete! Time taken: ",
            time.time() - start_time,
            " seconds",
        )
    except Exception as e:
        st.write("Evaluating Models Failed.")
        st.write(e)
        return

    """ ------ Plotting Results ------ """
    start_time = time.time()
    try:
        df_sp500_ = get_baseline(
            ticker="^GSPC", start=TEST_START_DATE, end=TEST_END_DATE
        )
        df_sp500 = pd.DataFrame()
        df_sp500["date"] = df_account_value["date"]
        df_sp500["account_value"] = (
            df_sp500_["close"] / df_sp500_["close"][0] * hp_kwargs["account_value"]
        )
        df_sp500.to_csv("datasets/SP500.csv")
        plot_allAgents(
            df_account_value,
            df_sp500,
            df_summary,
            hp_kwargs["rebalance_window"],
            hp_kwargs["validation_window"],
        )
        plot_dict = get_hrp_hrc(df)
        plot_dict["RL"] = df_account_value
        plot_dict["SPY"] = df_sp500

        plot_fullComparison(plot_dict, initial_value=hp_kwargs["account_value"])
        plot_stock_performance(df_summary, df, RESULTS_DIR)

        st.write(
            "Plotting Results Complete! Time taken: ",
            time.time() - start_time,
            " seconds",
        )
    except Exception as e:
        st.write("Plotting Results Failed.")
        st.write(e)
        return

    """ ------ Portfolio Weights ------ """
    try:
        populate_weights()
    except Exception as e:
        st.write("Weights Calculation Failed.")
        st.write(e)
        return

    """ ------ Cleaning Results ------ """
    final_path = coallate_directories()
    st.write("Results:")

    st.image(f"{final_path}/plots/agents_plot.png", caption="Agent Performance")
    stats = backtest_stats(df_account_value, value_col_name="account_value")
    ## Add more rows to stats if needed
    stats.to_csv(f"{final_path}/stats.csv")
    st.write("Backtest Stats:")
    st.write(stats)
    st.header("Finished! Click [here](/Results) to view the results.")
    st.image("examples/logo.png", width=300)
    return None


def main():
    st.set_page_config(layout="wide")
    st.image("examples/logo.png")

    app()


if __name__ == "__main__":
    main()
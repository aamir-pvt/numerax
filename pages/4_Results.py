import os
import shutil

import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st


def results_page():
    # Find all folders in runs directory and display them as options
    st.title("Results Page")
    st.write("Please select a run to view the backtest results.")
    run_folders = sorted(os.listdir("runs"), reverse=True)
    run = st.selectbox("Select a run", run_folders, placeholder="Select a run")
    return run


def print_stats(run):
    """
    Print the statistics of the run with the Agent Trading History and Comparison Plot.
    Parameters:
        - run (str): The run folder to display the results for.
    """

    full_results, results_stats = st.columns([2, 1])
    with full_results:
        st.image(
            f"runs/{run}/plots/full_comparison_plot.png",
            width=1000,
            use_column_width=True,
        )
    with results_stats:
        file_contents = pd.read_csv(f"runs/{run}/stats.csv", index_col=0).dropna()
        st.dataframe(file_contents, width=1000, height=425)

    st.subheader("Agent Trading History")
    agent_results, results_stats = st.columns([2, 1])
    with agent_results:
        st.image(
            f"runs/{run}/plots/agents_plot.png",
            width=1000,
            use_column_width=True,
        )
    with results_stats:
        file_contents = pd.read_csv(f"runs/{run}/stats.csv", index_col=0).dropna()
        st.dataframe(file_contents, width=1000, height=425)


def get_weighting(run):
    """
    Get the portfolio weights of the run and display them as a pie chart.
    Parameters:
        - run (str): The run folder to display the portfolio weights
    """

    st.subheader("Portfolio Weights")
    pie_chart, weight_stats = st.columns([2, 1])
    df = pd.read_csv(f"runs/{run}/weights/portfolioWeights.csv", index_col=0).drop(
        "date", axis=1
    )
    with weight_stats:
        st.dataframe(
            df[df > 0].iloc[-1].sort_values(ascending=False),
            height=750,
            use_container_width=True,
        )
        # Create a pie chart of the portfolio weights
        weights = df.iloc[-1].sort_values(ascending=False)
        weights = weights[weights > 0]
    with pie_chart:
        fig, ax = plt.subplots(figsize=(6, 4))
        ax.pie(weights, labels=weights.index, autopct="%1.1f%%")
        fig.suptitle("Portfolio Weights Distribution")
        # reduce text size
        for text in ax.texts:
            text.set_fontsize(8)
        plt.tight_layout()
        st.pyplot(fig, use_container_width=False)


def get_kwargs(run):
    """
    Display the model kwargs for the run as a dataframe.
    Parameters:
        - run (str): The run folder to display the model kwargs
    """

    st.subheader("Model Kwargs for Historical Reference")
    json_file = pd.read_json(f"runs/{run}/results/model_kwargs.json")
    timesteps = json_file["timesteps_dict"].dropna()
    json_file.drop("timesteps_dict", axis=1, inplace=True)
    json_file.drop(["a2c", "ppo", "ddpg", "sac", "td3"], inplace=True, errors="ignore")

    json_file.loc["training_timesteps"] = None
    for model in json_file.columns:
        for timestep in timesteps.index:
            if timestep in model.lower():
                json_file.loc["training_timesteps", model] = timesteps[timestep]

    st.dataframe(json_file, width=1000, use_container_width=True)


def view_performers(run):
    """
    View the best and worst performers of the run on different validation periods.
    Parameters:
        - run (str): The run folder to display the best and worst performers
    """

    st.header("Best and Worst Performers")
    performer_folder = [x for x in os.listdir(f"runs/{run}/plots") if "best_worst" in x]
    performer_path = st.selectbox("Select a validation period", performer_folder)
    st.image(f"runs/{run}/plots/{performer_path}", width=1000)


def summarize_results(run):
    """
    Summarize the results of the run with the following sections:
    - Tail Distribution
    - Backtest Results
    - Portfolio Weights Distribution
    - Best and Worst Performers
    - Model Kwargs History
    - Download the run folder

    Parameters:
        - run (str): The run folder to display the results
    """

    st.header(f"View Results Summary for: {run}")

    # Load the Portfolio Tail Distribution
    with st.expander("Tail Distribution", expanded=False):
        st.subheader("Tail Distribution")
        st.image(f"runs/{run}/plots/tailDistribution.png", width=1000)

    # Load the Reinforcement Learning Model Results
    with st.expander("Backtest Results", expanded=False):
        st.subheader("Full Comparison Plot")
        print_stats(run)

    # Load the Portfolio Weights Distribution
    with st.expander("Portfolio Weights Distribution of RL Model", expanded=False):
        get_weighting(run)

    # Load the Best and Worst Performers per Validation Period
    with st.expander("Best and Worst Performers", expanded=False):
        view_performers(run)

    # Load the Model Kwargs for Historical Reference
    with st.expander("Model Kwargs History", expanded=False):
        get_kwargs(run)

    # Button to download the run folder
    st.header(f"Download the full run folder: {run}")
    with open(f"runs/{run}/archive.zip", "rb") as fp:
        btn = st.download_button(
            label="Download ZIP",
            data=fp,
            file_name=f"{run}.zip",
            mime="application/zip",
        )


def main():
    st.set_page_config(layout="wide")
    st.image("examples/logo.png")
    summarize_results(results_page())


if __name__ == "__main__":
    main()

import streamlit as st


def main_screen():
    st.image("examples/logo.png")

    st.title("Reinforcement Learning Trading Pipeline\n Tri Cao, Obtin Zandian")
    st.markdown("***")
    st.write(
        "The Reinforcment Learning Pipeline is a tool that can be\
        used to study the performance of different reinforcement\
        learning algorithms on stock trading. The Deep Ensemble\
        Reinforcement Learning (DERL) model is a combination of\
        multiple reinforcement learning algorithms, including\
        TD3, A2C, PPO, DDPG, and SAC."
    )

    st.markdown("***")
    st.header("Getting Started")
    st.code(
        """
        1. Insert API Key
        2. Upload Stock Tickers
        3. Select Training Models
        4. Select Hyperparameters
        5. Select Training and Trading Dates
        6. Update Model Config Files
        7. Run the Pipeline
        """
    )


def main():
    st.set_page_config(page_title="Dashboard", layout="wide")
    main_screen()


if __name__ == "__main__":
    main()

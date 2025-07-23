import streamlit as st


def model_info():
    """Displays information about the models used in the pipeline."""
    st.image("examples/logo.png")
    st.title("Reinforcement Learning Model Background Information")
    st.markdown("***")

    st.header("Models")
    st.write(
        "For our pipeline, we reccomend selecting all models except PPO\
        due to its training time."
    )

    with st.expander("⚡️ DDPG: Deep Deterministic Policy Gradient"):
        st.write(
            """
            Deep Deterministic Policy Gradient (DDPG) is an algorithm which concurrently learns a Q-function and a policy. It uses off-policy data and the Bellman equation to learn the Q-function, and uses the Q-function to learn the policy.
            \n [More Information](https://spinningup.openai.com/en/latest/algorithms/ddpg.html)
        """
        )
    with st.expander("🎱 TD3: Twin Delayed DDPG"):
        st.write(
            """
            While DDPG can achieve great performance sometimes, it is frequently brittle with respect to hyperparameters and other kinds of tuning. A common failure mode for DDPG is that the learned Q-function begins to dramatically overestimate Q-values, which then leads to the policy breaking, because it exploits the errors in the Q-function. Twin Delayed DDPG (TD3) is an algorithm that addresses this issue by introducing three critical tricks:

Trick One: Clipped Double-Q Learning. TD3 learns two Q-functions instead of one (hence “twin”), and uses the smaller of the two Q-values to form the targets in the Bellman error loss functions.

Trick Two: “Delayed” Policy Updates. TD3 updates the policy (and target networks) less frequently than the Q-function. The paper recommends one policy update for every two Q-function updates.

Trick Three: Target Policy Smoothing. TD3 adds noise to the target action, to make it harder for the policy to exploit Q-function errors by smoothing out Q along changes in action.

Together, these three tricks result in substantially improved performance over baseline DDPG.
            \n [More Information](https://spinningup.openai.com/en/latest/algorithms/td3.html)
        """
        )
    with st.expander("🌪️ PPO: Proximal Policy Optimization"):
        st.write(
            """
PPO is motivated by the same question as TRPO: how can we take the biggest possible improvement step on a policy using the data we currently have, without stepping so far that we accidentally cause performance collapse? Where TRPO tries to solve this problem with a complex second-order method, PPO is a family of first-order methods that use a few other tricks to keep new policies close to old. PPO methods are significantly simpler to implement, and empirically seem to perform at least as well as TRPO.

There are two primary variants of PPO: PPO-Penalty and PPO-Clip.

PPO-Penalty approximately solves a KL-constrained update like TRPO, but penalizes the KL-divergence in the objective function instead of making it a hard constraint, and automatically adjusts the penalty coefficient over the course of training so that it’s scaled appropriately.

PPO-Clip doesn’t have a KL-divergence term in the objective and doesn’t have a constraint at all. Instead relies on specialized clipping in the objective function to remove incentives for the new policy to get far from the old policy.
            \n [More Information](https://spinningup.openai.com/en/latest/algorithms/ppo.html)
        """
        )
    with st.expander("🤖 A2C: Advantage Actor-Critic"):
        st.write(
            """
A2C works by synchronizing multiple agents to interact with the environment, collecting experiences, calculating advantages, and updating the actor and critic networks in a coordinated manner. This approach improves stability and efficiency over asynchronous methods like A3C.
            \n [More Information](https://huggingface.co/blog/deep-rl-a2c)
        """
        )
    with st.expander("🦾 SAC: Soft Actor-Critic"):
        st.write(
            """
Soft Actor Critic (SAC) is an algorithm that optimizes a stochastic policy in an off-policy way, forming a bridge between stochastic policy optimization and DDPG-style approaches. It isn’t a direct successor to TD3 (having been published roughly concurrently), but it incorporates the clipped double-Q trick, and due to the inherent stochasticity of the policy in SAC, it also winds up benefiting from something like target policy smoothing.

A central feature of SAC is entropy regularization. The policy is trained to maximize a trade-off between expected return and entropy, a measure of randomness in the policy. This has a close connection to the exploration-exploitation trade-off: increasing entropy results in more exploration, which can accelerate learning later on. It can also prevent the policy from prematurely converging to a bad local optimum.
            \n [More Information](https://spinningup.openai.com/en/latest/algorithms/sac.html)
        """
        )
    st.markdown("***")

    st.header("Data")
    st.write(
        "The data used in this pipeline is from the Yahoo Finance API\
        and the EOD Historical Data API. The data includes the stock\
        prices for the selected tickers and the corresponding dates."
    )


def main():
    st.set_page_config(layout="wide")
    model_info()


if __name__ == "__main__":
    main()

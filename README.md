# 🧠 USF Practicum - Deep Ensemble Reinforcement Learning Trading

This repository contains a reinforcement learning (RL) ensemble trading system that can be run either through a classic Streamlit-based interface or a modern full-stack architecture with FastAPI + React. The system trains and tests multiple RL agents on financial market data, leveraging ensemble techniques to optimize portfolio performance.

---

## 📁 Project Structure

```
Reinforcement-Learning/
├── Home.py              # ✅ Streamlit app (classic version)
├── backend/             # 🧠 FastAPI backend: pipeline + RL logic
├── frontend/            # 💻 React frontend: web interface
├── requirements.txt     # 🔧 Dependencies
├── README.md            # 📘 This file
```

---

## 🔵 Option 1: Streamlit-Based Web App (`Home.py`)

A simple all-in-one solution using Streamlit.

### 🛠 Quickstart

1. **Create a new Python environment**

```bash
python3 -m venv myenv
source myenv/bin/activate
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Run the application**

```bash
streamlit run Home.py
```

4. **Follow the interface** to:
   - Upload ticker data
   - Select models and parameters
   - Visualize agent results and backtest stats

---

### 📈 What It Does

- Trains multiple RL agents (A2C, PPO, DDPG, SAC, TD3)
- Compares with S&P 500 and HRP/HERC benchmarks
- Plots agent performance, weights, risk distributions

---

Here's your updated **README** section that includes **two backend options** (pip install **or** Docker image from Docker Hub), along with the correct frontend command (`npm run dev` instead of `npm start`):

---

## 🟢 Option 2: Full Stack Version (FastAPI + React)

A modular, production-ready pipeline with API and frontend separation.

---

### ⚙️ Backend Setup (FastAPI)

You can either set up the backend via **pip install** or run the **pre-built Docker image** from Docker Hub.

#### ✅ Option A: Python Virtual Environment

```bash
cd backend
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- Your API is now live at: `http://127.0.0.1:8000`
- Logs, plots, and downloadable ZIPs are automatically created

If choosing Option A, then you need to make sure all the API endpoints of frontend is `http://127.0.0.1:8000`

#### 🐳 Option B: Pull from Docker Hub

Ask Jean for account credentials.

Then, download Docker locally and log in to Jean's docker hub account.

```bash
docker pull yourusername/rl-backend:latest
docker run -p 8000:8000 yourusername/rl-backend
```

- Make sure to replace `yourusername` with Jean's Docker Hub username
- The backend will be accessible at: `http://0.0.0.0:8000`

If choosing Option B, then you need to make sure all the API endpoints of frontend is `http://0.0.0.0:8000`

---

### 💻 Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- Opens `http://localhost:5173/`
- Upload tickers, select models, configure hyperparameters
- Run the pipeline, stream logs, view plots, and download outputs

---

### 🧱 Modular Features

- ✅ Model selection (A2C, PPO, DDPG, SAC, TD3)
- 📊 Auto backtesting vs SP500 & HRP/HERC
- 🖼️ Plot rendering and download
- 💾 Download training output ZIPs

---

## ⚠️ Important Notes

- GitHub cannot store large binary `.zip` or model files > 100MB
- Be sure `.gitignore` includes:
  ```gitignore
  myenv/
  backend/runs/
  backend/results/
  backend/tensorboard_logs/
  ```

---

## 📚 References

- [FinRL Documentation](https://finrl.readthedocs.io/en/latest/index.html)
- [OpenAI Baselines](https://spinningup.openai.com/en/latest/)
- [Deep RL with Huggingface](https://huggingface.co/blog/deep-rl-a2c)

---

Choose the version best suited to your workflow — quick prototyping (Streamlit) or scalable APIs (FastAPI + React).

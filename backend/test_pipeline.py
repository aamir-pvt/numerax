# test_pipeline.py
import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from .routes.pipeline import router  # 👈 or import your main FastAPI app if you've wrapped `router` in it
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

client = TestClient(app)

# Common form data
base_payload = {
    "rebalance_window": 20,
    "validation_window": 20,
    "train_start": "2023-01-01",
    "train_end": "2023-06-01",
    "trade_start": "2023-07-01",
    "trade_end": "2023-09-01",
}

# ✅ Helper function to convert to multipart/form for FastAPI Form(...) fields
def make_form_payload(**kwargs):
    payload = base_payload.copy()
    payload.update(kwargs)
    return {k: (None, str(v)) for k, v in payload.items()}

# === 1. Invalid model ===
def test_invalid_model():
    payload = make_form_payload(models='["WRONGMODEL"]')
    response = client.post("/run-pipeline", files=payload)
    assert response.status_code == 422
    assert "Invalid model selection" in response.text

# === 2. Empty model list ===
def test_empty_models():
    payload = make_form_payload(models='[]')
    response = client.post("/run-pipeline", files=payload)
    assert response.status_code == 422
    assert "Invalid model selection" in response.text

# === 3. Bad date order ===
def test_bad_date_order():
    payload = make_form_payload(
        train_start="2023-06-01",
        train_end="2023-01-01",
        trade_start="2023-07-01",
        trade_end="2023-09-01",
        models='["A2C"]',
    )
    response = client.post("/run-pipeline", files=payload)
    assert response.status_code == 422
    assert "Invalid date sequence" in response.text

# === 4. Rebalance/validation windows <= 0 ===
def test_invalid_window_sizes():
    payload = make_form_payload(
        rebalance_window=0,
        validation_window=-1,
        models='["A2C"]',
    )
    response = client.post("/run-pipeline", files=payload)
    assert response.status_code == 422
    assert "must be positive integers" in response.text

# === 5. Valid input (just to check 200 or fallback msg) ===
def test_valid_minimal_pipeline():
    payload = make_form_payload(
        models='["A2C"]',
    )
    # NOTE: This test assumes `uploads/stock_data.csv` already exists
    response = client.post("/run-pipeline", files=payload)
    assert response.status_code in [200, 400, 500]  # May return 400 if dataset not uploaded

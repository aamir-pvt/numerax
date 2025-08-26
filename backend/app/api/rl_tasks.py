from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from celery import Celery
from app.models.run_config import RunConfig
from typing import List

import os

from app.db.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.rl import RLRunRequest, RunConfigOut
from app.models.portfolio import Portfolio

router = APIRouter()

# Celery config
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
celery = Celery("backend", broker=REDIS_URL, backend=REDIS_URL)

@router.post("/{portfolio_id}/run-rl-algo")
def run_rl_algo(
    portfolio_id: int,
    request: RLRunRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("Received RL run request:")
    print("Portfolio ID:", portfolio_id)
    print("Request body:", request)

    portfolio = db.query(Portfolio).filter_by(id=portfolio_id, user_id=current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    # Save the run config to DB
    run_config = RunConfig(
        user_id=current_user.id,
        account_value=request.account_value,
        max_shares=request.max_shares,
        rebalance_window=request.rebalance_window,
        validation_window=request.validation_window,
        train_start=request.train_start,
        train_end=request.train_end,
        trade_start=request.trade_start,
        trade_end=request.trade_end,
        model_names=request.model_names
    )
    db.add(run_config)
    db.commit()
    db.refresh(run_config)

    # Send full request + run_config ID to Celery
    request_data = request.model_dump()
    request_data["run_config_id"] = run_config.id  # attach for traceability

    task = celery.send_task(
        "rl_tasks.run_rl_job",
        args=[portfolio_id, request_data],
        queue="rl_queue"
    )

    return {
        "message": "RL task queued",
        "task_id": task.id,
        "run_config_id": run_config.id
    }



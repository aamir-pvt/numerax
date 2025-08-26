from pydantic import BaseModel
from typing import List
from datetime import date
from typing import Optional


class RLRunRequest(BaseModel):
    account_value: float
    max_shares: int
    rebalance_window: int
    validation_window: int
    train_start: date
    train_end: date
    trade_start: date
    trade_end: date
    model_names: List[str]


class RunConfigOut(BaseModel):
    id: int
    account_value: float
    max_shares: int
    rebalance_window: int
    validation_window: int
    train_start: date
    train_end: date
    trade_start: date
    trade_end: date
    model_names: List[str]

    class Config:
        orm_mode = True



class RunResultOut(BaseModel):
    cumulative_return: Optional[float]
    max_drawdown: Optional[float]
    volatility: Optional[float]
    sharpe_ratio: Optional[float]
    sortino_ratio: Optional[float]
    calmar_ratio: Optional[float]
    win_rate: Optional[float]
    final_portfolio_value: Optional[float]

    class Config:
        orm_mode = True

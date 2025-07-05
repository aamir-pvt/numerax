from pydantic import BaseModel
from typing import List
from datetime import datetime

class PortfolioAssetOut(BaseModel):
    id: int
    ticker: str
    weight: float
    added_at: datetime

    class Config:
        orm_mode = True

class PortfolioResultOut(BaseModel):
    id: int
    analysis_type: str
    result_json: dict
    created_at: datetime

    class Config:
        orm_mode = True

class PortfolioOut(BaseModel):
    id: int
    name: str
    created_at: datetime
    assets: List[PortfolioAssetOut] = []

    class Config:
        orm_mode = True

class PortfolioCreate(BaseModel):
    name: str

class PortfolioAnalysisRequest(BaseModel):
    analysis_type: str


from pydantic import BaseModel

class AddTickerRequest(BaseModel):
    portfolio_id: int
    ticker: str

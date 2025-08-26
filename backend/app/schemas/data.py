from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import date as dt_date

class PriceRecord(BaseModel):
    trade_date: dt_date = Field(..., alias="date", example="2020-01-02")
    open: float = Field(..., example=296.24)
    high: float = Field(..., example=300.6)
    low: float = Field(..., example=295.19)
    close: float = Field(..., example=300.35)
    adjusted_close: float = Field(..., example=72.6208)
    volume: int = Field(..., example=135480400)

    class Config:
        from_attributes = True
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "date": "2020-01-02",
                "open": 296.24,
                "high": 300.6,
                "low": 295.19,
                "close": 300.35,
                "adjusted_close": 72.6208,
                "volume": 135480400
            }
        }


class PricesResponse(BaseModel):
    results: Dict[str, List[PriceRecord]]

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "results": {
                    "AAPL": [
                        {
                            "date": "2020-01-02",
                            "open": 296.24,
                            "high": 300.6,
                            "low": 295.19,
                            "close": 300.35,
                            "adjusted_close": 72.6208,
                            "volume": 135480400
                        },
                        {
                            "date": "2020-01-03",
                            "open": 297.15,
                            "high": 300.58,
                            "low": 296.5,
                            "close": 297.43,
                            "adjusted_close": 71.9148,
                            "volume": 146322800
                        }
                    ]
                }
            }
        }


class TickerListResponse(BaseModel):
    tickers: List[str] = Field(..., example=["AAPL", "GOOGL", "MSFT"])
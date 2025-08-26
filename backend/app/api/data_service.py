from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.db.database import get_db
from app.schemas.data import PricesResponse, PriceRecord, TickerListResponse
from app.services.data_fetcher import search_tickers
from app.models.user import User
from app.api.auth import get_current_user
import requests, logging, os

router = APIRouter(prefix="/data", tags=["Data Service"])

EOD_API_KEY = os.getenv("EOD_API_KEY") or ""
EOD_API_URL = "https://eodhistoricaldata.com/api/eod"


@router.get("/prices", response_model=PricesResponse)
def get_stock_prices(
    tickers: str = Query(..., description="Comma-separated stock tickers, e.g. AAPL,MSFT"),
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
    period: str = Query("d", description="Data frequency: d=Daily, w=Weekly, m=Monthly"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # <-- require login
):
    if not EOD_API_KEY:
        raise HTTPException(status_code=500, detail="EOD_API_KEY not configured")

    results = {}
    ticker_list = [t.strip().upper() for t in tickers.split(",")]

    for ticker in ticker_list:
        try:
            query = text("""
                SELECT date AS trade_date, open, high, low, close, adjusted_close, volume
                FROM eod_prices
                WHERE ticker = :ticker
                  AND date BETWEEN :start AND :end
                ORDER BY date
            """)
            rows = db.execute(query, {"ticker": ticker, "start": start, "end": end}).fetchall()
            if rows:
                results[ticker] = [PriceRecord(**dict(row._mapping)) for row in rows]
                continue
        except Exception as e:
            logging.warning(f"[DB Error] Skipping DB fetch for {ticker}: {e}")

        # Fallback to EOD API
        try:
            url = f"{EOD_API_URL}/{ticker}.US"
            params = {"from": start, "to": end, "api_token": EOD_API_KEY, "period": period, "fmt": "json"}
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            eod_data = response.json()
            results[ticker] = [
                PriceRecord(
                    trade_date=rec["date"],
                    open=rec.get("open"),
                    high=rec.get("high"),
                    low=rec.get("low"),
                    close=rec.get("close"),
                    adjusted_close=rec.get("adjusted_close"),
                    volume=rec.get("volume"),
                )
                for rec in eod_data
            ]
        except Exception as e:
            logging.error(f"[EOD Error] Failed for {ticker}: {e}")
            results[ticker] = []

    return PricesResponse(results=results)


@router.get("/etfs", response_model=PricesResponse)
def get_etf_prices(
    tickers: str = Query(..., description="Comma-separated ETF tickers"),
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
    period: str = Query("d", description="Data frequency: d=Daily, w=Weekly, m=Monthly"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not EOD_API_KEY:
        raise HTTPException(status_code=500, detail="EOD_API_KEY not configured")

    results = {}
    ticker_list = [t.strip().upper() for t in tickers.split(",")]

    for ticker in ticker_list:
        try:
            query = text("""
                SELECT date AS trade_date, open, high, low, close, adjusted_close, volume
                FROM etf_levels
                WHERE ticker = :ticker
                  AND date BETWEEN :start AND :end
                ORDER BY date
            """)
            rows = db.execute(query, {"ticker": ticker, "start": start, "end": end}).fetchall()
            if rows:
                results[ticker] = [PriceRecord(**dict(row._mapping)) for row in rows]
                continue
        except Exception as e:
            logging.warning(f"[DB Error] Skipping DB fetch for {ticker}: {e}")

        try:
            url = f"{EOD_API_URL}/{ticker}.US"
            params = {"from": start, "to": end, "api_token": EOD_API_KEY, "period": period, "fmt": "json"}
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            eod_data = response.json()
            results[ticker] = [
                PriceRecord(
                    trade_date=rec["date"],
                    open=rec.get("open"),
                    high=rec.get("high"),
                    low=rec.get("low"),
                    close=rec.get("close"),
                    adjusted_close=rec.get("adjusted_close"),
                    volume=rec.get("volume"),
                )
                for rec in eod_data
            ]
        except Exception as e:
            logging.error(f"[EOD Error] Failed for {ticker}: {e}")
            results[ticker] = []

    return PricesResponse(results=results)


@router.get("/tickers", response_model=TickerListResponse)
def list_tickers(
    q: str | None = Query(default=None, description="Optional prefix to search tickers"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {"tickers": search_tickers(db, q)}

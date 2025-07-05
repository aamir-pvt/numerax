import pandas as pd
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.portfolio import Portfolio, PortfolioAsset, PortfolioResult
from app.models.user import User
from app.schemas.portfolio import PortfolioOut
from datetime import datetime, timezone
import re

# Dummy validator (replace with API lookup or static list if needed)
def is_valid_ticker(ticker: str) -> bool:
    return bool(re.fullmatch(r"[A-Z]{1,5}\.US", ticker))  # e.g. AAPL, TSLA, MSFT

def create_portfolio(name: str, db: Session, user: User) -> Portfolio:
    portfolio = Portfolio(name=name, user_id=user.id)
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    return portfolio

def add_assets_to_portfolio_from_csv(portfolio_id: int, df: pd.DataFrame, db: Session, user: User):
    if df.shape[1] != 1:
        raise HTTPException(status_code=400, detail="CSV must contain exactly one column with tickers.")

    portfolio = db.query(Portfolio).filter_by(id=portfolio_id, user_id=user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    for _, row in df.iterrows():
        ticker = str(row[0]).strip().upper()
        if not ticker:
            continue
        if not is_valid_ticker(ticker):
            raise HTTPException(status_code=400, detail=f"Invalid ticker symbol: {ticker}")

        asset = PortfolioAsset(
            portfolio_id=portfolio.id,
            ticker=ticker,
            weight=1.0
        )
        db.add(asset)

    db.commit()
    return {"detail": "Assets successfully added."}

def add_single_ticker(db: Session, portfolio: Portfolio, ticker: str):
    standardized_ticker = f"{ticker.strip().upper()}.US"

    # Optional: check for duplicates
    existing = db.query(PortfolioAsset).filter_by(
        portfolio_id=portfolio.id, ticker=standardized_ticker
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Ticker already exists in portfolio")

    asset = PortfolioAsset(
        portfolio_id=portfolio.id,
        ticker=standardized_ticker,
        weight=1.0
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


def run_dummy_analysis(portfolio_id: int, analysis_type: str, db: Session, user: User):
    portfolio = db.query(Portfolio).filter_by(id=portfolio_id, user_id=user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    dummy_result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "note": f"Dummy {analysis_type} analysis successful"
    }

    result = PortfolioResult(
        portfolio_id=portfolio.id,
        analysis_type=analysis_type,
        result_json=dummy_result
    )
    db.add(result)
    db.commit()
    return {"detail": f"{analysis_type} analysis completed."}

def get_portfolio_results(portfolio_id: int, db: Session, user: User):
    portfolio = db.query(Portfolio).filter_by(id=portfolio_id, user_id=user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    return db.query(PortfolioResult).filter_by(portfolio_id=portfolio.id).all()

def get_user_portfolios(db: Session, user: User):
    return db.query(Portfolio).filter_by(user_id=user.id).all()

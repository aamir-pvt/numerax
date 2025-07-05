from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
from app.db.database import get_db
from app.schemas.portfolio import PortfolioOut, PortfolioResultOut
from app.services.portfolio_service import (
    create_portfolio,
    add_assets_to_portfolio_from_csv,
    run_dummy_analysis,
    get_portfolio_results,
    get_user_portfolios
)
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.portfolio import AddTickerRequest
from app.services import portfolio_service


router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)

@router.post("/create", response_model=PortfolioOut)
def create_new_portfolio(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_portfolio(name=name, db=db, user=current_user)

@router.post("/{portfolio_id}/add-assets-csv")
def add_assets_csv(
    portfolio_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        df = pd.read_csv(file.file)
        return add_assets_to_portfolio_from_csv(portfolio_id, df, db, current_user)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or corrupt CSV file.")
    

@router.post("/add-ticker")
def add_ticker_to_portfolio(request: AddTickerRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    portfolio = db.query(portfolio_service.Portfolio).filter_by(id=request.portfolio_id, user_id=current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    ticker = request.ticker.strip().upper()
    if not portfolio_service.is_valid_ticker(ticker):
        raise HTTPException(status_code=400, detail="Invalid ticker format")

    asset = portfolio_service.add_single_ticker(db, portfolio, ticker)
    return {"detail": f"{asset.ticker} added to portfolio {portfolio.name}"}

@router.post("/{portfolio_id}/analyze")
def trigger_analysis(
    portfolio_id: int,
    analysis_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return run_dummy_analysis(portfolio_id, analysis_type, db, current_user)

@router.get("/{portfolio_id}/results", response_model=List[PortfolioResultOut])
def get_results(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_portfolio_results(portfolio_id, db, current_user)

@router.get("/my", response_model=List[PortfolioOut])
def list_user_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_portfolios(db, current_user)

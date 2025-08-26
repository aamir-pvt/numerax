# app/models/run_result.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class RunResult(Base):
    __tablename__ = "run_results"

    id = Column(Integer, primary_key=True, index=True)
    run_config_id = Column(Integer, ForeignKey("run_configs.id"), unique=True)

    cumulative_return = Column(Float)
    sharpe_ratio = Column(Float)
    max_drawdown = Column(Float)
    volatility = Column(Float)
    sortino_ratio = Column(Float)
    calmar_ratio = Column(Float)
    win_rate = Column(Float)
    final_portfolio_value = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    run_config = relationship("RunConfig", back_populates="result")

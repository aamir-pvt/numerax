# app/models/run_config.py
from sqlalchemy import Column, Integer, Float, String, Date, ARRAY, ForeignKey
from sqlalchemy.orm import relationship
from app.models.user import User  # import User to register relationship
from app.db.database import Base


class RunConfig(Base):
    __tablename__ = "run_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    account_value = Column(Float, nullable=False)
    max_shares = Column(Integer, nullable=False)
    rebalance_window = Column(Integer, nullable=False)
    validation_window = Column(Integer, nullable=False)
    train_start = Column(Date, nullable=False)
    train_end = Column(Date, nullable=False)
    trade_start = Column(Date, nullable=False)
    trade_end = Column(Date, nullable=False)
    model_names = Column(ARRAY(String), nullable=False)

    user = relationship("User", backref="run_configs")
    result = relationship("RunResult", uselist=False, back_populates="run_config")
    artifacts = relationship("RunArtifacts", uselist=False, back_populates="run_config")

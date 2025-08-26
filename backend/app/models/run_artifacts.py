# app/models/run_artifacts.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class RunArtifacts(Base):
    __tablename__ = "run_artifacts"

    id = Column(Integer, primary_key=True, index=True)
    run_config_id = Column(Integer, ForeignKey("run_configs.id"), unique=True)

    plot_comparison = Column(String)
    plot_rewards = Column(String)
    plot_tail_dist = Column(String)
    plot_pie_weights = Column(String)
    best_worst_40 = Column(String)
    best_worst_60 = Column(String)
    best_worst_80 = Column(String)

    account_value_csv = Column(String)
    actions_csv = Column(String)
    rewards_csv = Column(String)
    weights_csv = Column(String)
    stats_csv = Column(String)
    config_json = Column(String)
    log_file = Column(String)
    archive_zip = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    run_config = relationship("RunConfig", back_populates="artifacts")

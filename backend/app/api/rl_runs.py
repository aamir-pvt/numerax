from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.run_config import RunConfig
from app.schemas.rl import RunConfigOut

router = APIRouter()

@router.get("/runs/me", response_model=List[RunConfigOut])
def get_my_run_configs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    runs = (
        db.query(RunConfig)
        .filter_by(user_id=current_user.id)
        .order_by(RunConfig.id.desc())
        .all()
    )
    return runs

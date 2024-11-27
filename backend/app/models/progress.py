from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class ProgressMetric(Base):
    __tablename__ = "progress_metrics"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    metric_type: Mapped[str] = mapped_column(String(50))
    value: Mapped[float] = mapped_column(Float)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    metric_metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # Changed from metadata to metric_metadata

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="progress_metrics")
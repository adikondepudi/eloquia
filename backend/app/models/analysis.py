from datetime import datetime
from typing import Optional
from sqlalchemy import Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    recording_id: Mapped[int] = mapped_column(ForeignKey("recordings.id", ondelete="CASCADE"))
    total_disfluencies: Mapped[int] = mapped_column()
    disfluency_rate: Mapped[float] = mapped_column(Float)
    speech_rate: Mapped[float] = mapped_column(Float)
    fluency_score: Mapped[float] = mapped_column(Float)
    detailed_analysis: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    recording: Mapped["Recording"] = relationship("Recording", back_populates="analysis_results")
from typing import List, Dict
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.progress import ProgressMetric
from ..models.analysis import AnalysisResult

async def calculate_progress_metrics(
    db: Session,
    user_id: int,
    time_period: timedelta = timedelta(days=30)
) -> ProgressMetric:
    start_date = datetime.now() - time_period
    
    analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == user_id,
        AnalysisResult.created_at >= start_date
    ).all()
    
    if not analyses:
        return None
    
    metrics = ProgressMetric(
        user_id=user_id,
        period_start=start_date,
        period_end=datetime.now(),
        total_recordings=len(analyses),
        average_disfluency_rate=_calculate_average_disfluency_rate(analyses),
        improvement_rate=_calculate_improvement_rate(analyses),
        disfluency_types_distribution=_calculate_disfluency_distribution(analyses)
    )
    
    db.add(metrics)
    db.commit()
    return metrics

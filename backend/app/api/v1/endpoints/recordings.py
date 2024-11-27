from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.api.deps import get_current_user, get_db, RateLimiter
from app.models.user import User
from app.models.recording import Recording
from app.models.analysis import AnalysisResult
from app.schemas.recording import (
    RecordingCreate,
    RecordingResponse,
    RecordingAnalysisResponse,
    RecordingListResponse,
    AnalysisStatus
)
from app.services.audio import process_audio_file
from app.services.ml_pipeline import analyze_recording
from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/recordings", tags=["recordings"])

# Rate limiting configuration
rate_limiter = RateLimiter(requests_per_minute=settings.UPLOAD_RATE_LIMIT)

@router.post(
    "/upload",
    response_model=RecordingResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limiter)]
)
def upload_recording(
    file: UploadFile = File(...),
    description: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> RecordingResponse:
    """
    Upload a new audio recording for analysis.
    """
    try:
        # Process and validate audio file
        recording = process_audio_file(file, current_user.id)
        recording.description = description
        recording.analysis_status = AnalysisStatus.PENDING
        
        # Save to database
        db.add(recording)
        db.commit()
        db.refresh(recording)
        
        # Start analysis in background task
        analyze_recording.delay(recording.id)  # Assuming Celery task
        
        logger.info(f"Recording uploaded successfully: {recording.id}")
        return RecordingResponse.from_orm(recording)
        
    except Exception as e:
        logger.error(f"Error uploading recording: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing recording"
        )

@router.get(
    "",
    response_model=RecordingListResponse
)
def list_recordings(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> RecordingListResponse:
    """
    List user's recordings with pagination.
    """
    recordings = (
        db.query(Recording)
        .filter(Recording.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    total = (
        db.query(Recording)
        .filter(Recording.user_id == current_user.id)
        .count()
    )
    
    return RecordingListResponse(
        total=total,
        items=recordings
    )

@router.get(
    "/{recording_id}",
    response_model=RecordingAnalysisResponse
)
def get_recording(
    recording_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> RecordingAnalysisResponse:
    """
    Get recording details with analysis results if available.
    """
    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id,
            Recording.user_id == current_user.id
        )
        .first()
    )
    
    if not recording:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recording not found"
        )
    
    return RecordingAnalysisResponse.from_orm(recording)

@router.delete(
    "/{recording_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_recording(
    recording_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a recording and its associated data.
    """
    recording = (
        db.query(Recording)
        .filter(
            Recording.id == recording_id,
            Recording.user_id == current_user.id
        )
        .first()
    )
    
    if not recording:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recording not found"
        )
    
    # Delete associated files
    try:
        recording.delete_files()  # Implement this method in Recording model
    except Exception as e:
        logger.error(f"Error deleting recording files: {str(e)}")
    
    # Delete from database
    db.delete(recording)
    db.commit()
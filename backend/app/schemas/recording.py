from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class RecordingBase(BaseModel):
    description: Optional[str] = None

class RecordingCreate(RecordingBase):
    pass

class RecordingResponse(RecordingBase):
    id: int
    user_id: int
    filename: str
    duration: float
    created_at: datetime
    analysis_status: AnalysisStatus
    
    class Config:
        from_attributes = True

class AnalysisMetrics(BaseModel):
    total_disfluencies: int
    disfluency_rate: float
    speech_rate: float
    fluency_score: float

class RecordingAnalysisResponse(RecordingResponse):
    analysis: Optional[AnalysisMetrics] = None

class RecordingListResponse(BaseModel):
    total: int
    items: List[RecordingResponse]
    
    class Config:
        from_attributes = True
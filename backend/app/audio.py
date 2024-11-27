from fastapi import UploadFile, HTTPException
import aiofiles
import os
import soundfile as sf
from datetime import datetime
from pathlib import Path
import shutil

from app.core.config import settings
from app.core.logging import logger
from app.models.recording import Recording, AnalysisStatus

class AudioValidationError(Exception):
    pass

async def get_audio_duration(file_path: str) -> float:
    """Calculate the duration of an audio file."""
    try:
        with sf.SoundFile(file_path) as audio_file:
            return len(audio_file) / audio_file.samplerate
    except Exception as e:
        logger.error(f"Error calculating audio duration: {str(e)}")
        raise AudioValidationError("Invalid audio file format")

async def validate_audio_file(file: UploadFile) -> None:
    """Validate audio file format and size."""
    if file.content_type not in settings.ALLOWED_AUDIO_TYPES:
        raise AudioValidationError(f"Invalid audio format. Allowed types: {settings.ALLOWED_AUDIO_TYPES}")
    
    # Check file size
    try:
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        
        if size > settings.MAX_AUDIO_SIZE_MB * 1024 * 1024:
            raise AudioValidationError(f"File too large. Maximum size: {settings.MAX_AUDIO_SIZE_MB}MB")
    except Exception as e:
        logger.error(f"Error validating file size: {str(e)}")
        raise AudioValidationError("Error validating file")

async def process_audio_file(file: UploadFile, user_id: int) -> Recording:
    """Process and store an uploaded audio file."""
    try:
        await validate_audio_file(file)
        
        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"user_{user_id}_{timestamp}{Path(file.filename).suffix}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Ensure upload directory exists
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # Get audio duration
        duration = await get_audio_duration(file_path)
        
        # Create recording object
        recording = Recording(
            user_id=user_id,
            filename=filename,
            file_path=file_path,
            duration=duration,
            analysis_status=AnalysisStatus.PENDING
        )
        
        return recording
        
    except AudioValidationError as e:
        logger.error(f"Audio validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing audio file: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing audio file")

async def cleanup_old_files():
    """Clean up old temporary files."""
    try:
        current_time = datetime.now().timestamp()
        
        # Cleanup uploaded files
        for file in os.listdir(settings.UPLOAD_DIR):
            file_path = os.path.join(settings.UPLOAD_DIR, file)
            if os.path.getctime(file_path) < current_time - settings.FILE_RETENTION_DAYS * 86400:
                os.remove(file_path)
        
        # Cleanup processed files
        for file in os.listdir(settings.PROCESSED_DIR):
            file_path = os.path.join(settings.PROCESSED_DIR, file)
            if os.path.getctime(file_path) < current_time - settings.FILE_RETENTION_DAYS * 86400:
                os.remove(file_path)
                
    except Exception as e:
        logger.error(f"Error cleaning up files: {str(e)}")
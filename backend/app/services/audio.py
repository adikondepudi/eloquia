from fastapi import UploadFile, HTTPException
import aiofiles
import os
from typing import Optional
import asyncio
from pathlib import Path

from ..core.config import get_settings
from ..models.recording import Recording

settings = get_settings()

async def process_audio_file(file: UploadFile, user_id: int) -> Recording:
    if file.content_type not in settings.ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid audio file type"
        )
    
    file_size = await get_file_size(file)
    if file_size > settings.MAX_AUDIO_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large"
        )
    
    filename = f"{user_id}_{datetime.now().timestamp()}{Path(file.filename).suffix}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    
    async with aiofiles.open(filepath, 'wb') as out_file:
        while content := await file.read(1024):
            await out_file.write(content)
    
    return Recording(
        user_id=user_id,
        filename=filename,
        file_path=filepath,
        duration=await get_audio_duration(filepath)
    )

// /types/upload.ts
/** Represents an audio recording uploaded by a user */
export interface AudioRecording {
  id: string;
  userId: string;
  filename: string;
  duration: number;
  fileSize: number;
  mimeType: string;
  url: string;
  transcription?: string;
  createdAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
}

/** Configuration for chunked upload */
export interface UploadConfig {
  chunkSize: number;
  maxFileSize: number;
  allowedTypes: string[];
  maxDuration: number;
}

/** Upload progress information */
export interface UploadProgress {
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
  status: 'preparing' | 'uploading' | 'processing' | 'complete' | 'error';
}
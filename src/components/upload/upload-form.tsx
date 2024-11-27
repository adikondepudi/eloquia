// /components/upload/upload-form.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-config';
import { UploadProgress, AudioRecording } from '@/types/upload';
import { Mic, Upload, Loader2 } from 'lucide-react';

interface UploadFormProps {
  onUploadSuccess?: (recording: AudioRecording) => void;
}

const ALLOWED_TYPES = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Please select a valid audio file (MP3, WAV, or M4A).');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 100MB.');
      return;
    }

    setError(null);
    setFile(selectedFile);
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setError(null);
      setUploadProgress({
        bytesUploaded: 0,
        totalBytes: file.size,
        percentage: 0,
        currentChunk: 0,
        totalChunks: Math.ceil(file.size / CHUNK_SIZE),
        status: 'preparing'
      });

      // Initialize upload
      const { data: { uploadId } } = await apiClient.initiateUpload(file);

      // Upload chunks
      for (let i = 0; i < Math.ceil(file.size / CHUNK_SIZE); i++) {
        const chunk = file.slice(
          i * CHUNK_SIZE,
          Math.min((i + 1) * CHUNK_SIZE, file.size)
        );
        const response = await apiClient.uploadChunk(uploadId, chunk, i);
        setUploadProgress(response.data);
      }

      // Handle successful upload
      if (onUploadSuccess) {
        onUploadSuccess({
          id: uploadId,
          userId: user.id,
          filename: file.name,
          duration: 0, // Will be updated after processing
          fileSize: file.size,
          mimeType: file.type,
          url: '#',
          createdAt: new Date().toISOString(),
          status: 'processing'
        });
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
      setUploadProgress(null);
    }
  };

  // Handle recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setFile(file);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Input Section */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isRecording}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
            <span className="text-sm font-medium">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-muted-foreground">
              MP3, WAV or M4A (max. 100MB)
            </span>
          </label>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording}
            className="gap-2"
          >
            <Mic className="h-4 w-4" />
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File Preview */}
      {file && !error && (
        <Alert>
          <AlertDescription>
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="space-y-2">
          <Progress value={uploadProgress.percentage} />
          <p className="text-sm text-muted-foreground">
            Uploading... {Math.round(uploadProgress.percentage)}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || !!uploadProgress}
        className="w-full"
      >
        {uploadProgress ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Recording'
        )}
      </Button>
    </div>
  );
};
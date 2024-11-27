import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function AudioRecorder() {
  const [isClient, setIsClient] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingError, setRecordingError] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      });

      setRecorder(mediaRecorder);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError('Failed to start recording. Please check your microphone permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      recorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [recorder]);

  const analyzeMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      return response.json();
    }
  });

  const handleAnalyze = useCallback(async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      await analyzeMutation.mutateAsync(blob);
    } catch (error) {
      console.error('Analysis error:', error);
      setRecordingError('Failed to analyze recording');
    }
  }, [audioUrl, analyzeMutation]);

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            <span>Stop Recording</span>
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <span>Start Recording</span>
          </button>
        )}

        {audioUrl && (
          <>
            <audio src={audioUrl} controls className="w-64" />
            <button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {analyzeMutation.isPending ? (
                <span>Analyzing...</span>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </>
        )}
      </div>

      {(recordingError || analyzeMutation.error) && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {recordingError || 'Failed to analyze recording. Please try again.'}
        </div>
      )}

      {analyzeMutation.isSuccess && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(analyzeMutation.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { AudioAnalysis, UserAnalytics, DisfluencyType } from '@/types/analytics';
import { AudioRecording, UploadProgress } from '@/types/upload';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiClient {
  private mockUserAnalytics: UserAnalytics = {
    totalRecordings: 15,
    totalDuration: 4500, // 75 minutes
    averageDisfluencyRate: 5.2, // Lower average to reflect improvement
    mostCommonDisfluency: 'repetition' as DisfluencyType,
    progressOverTime: Array.from({ length: 10 }, (_, i) => {
      // Start at higher rate and gradually improve
      const baseRate = 12 - (i * 0.8); // Steeper improvement
      const variation = Math.sin(i) * 0.3; // Subtle natural variation
      return {
        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
        disfluencyRate: Math.max(baseRate + variation, 3), // Ensure rate doesn't go below 3
      };
    }),
  };

  private mockRecordings: AudioRecording[] = Array.from({ length: 5 }, (_, i) => ({
    id: `recording-${i + 1}`,
    userId: 'mock-user',
    filename: `Recording ${i + 1}.mp3`,
    duration: 180 + Math.random() * 300,
    fileSize: 1024 * 1024 * (2 + Math.random() * 8),
    mimeType: 'audio/mpeg',
    url: '#',
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ready',
  }));

  async getUserAnalytics(userId: string): Promise<ApiResponse<UserAnalytics>> {
    await delay(800);
    return {
      data: this.mockUserAnalytics,
      error: null,
    };
  }

  async getRecordings(userId: string): Promise<PaginatedResponse<AudioRecording[]>> {
    await delay(600);
    return {
      data: this.mockRecordings,
      error: null,
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: this.mockRecordings.length,
        itemsPerPage: 10,
      },
    };
  }

  async initiateUpload(file: File): Promise<ApiResponse<{ uploadId: string }>> {
    await delay(500);
    return {
      data: { uploadId: 'mock-upload-' + Date.now() },
      error: null,
    };
  }

  async uploadChunk(
    uploadId: string,
    chunk: Blob,
    chunkIndex: number
  ): Promise<ApiResponse<UploadProgress>> {
    await delay(300);
    const progress: UploadProgress = {
      bytesUploaded: (chunkIndex + 1) * chunk.size,
      totalBytes: chunk.size * 5, // Assuming 5 chunks total
      percentage: ((chunkIndex + 1) / 5) * 100,
      currentChunk: chunkIndex,
      totalChunks: 5,
      status: chunkIndex === 4 ? 'complete' : 'uploading',
    };
    return {
      data: progress,
      error: null,
    };
  }

  async getAnalysis(recordingId: string): Promise<ApiResponse<AudioAnalysis>> {
    await delay(700);
    const recordingIndex = parseInt(recordingId.split('-')[1]) || 0;
    const baseRate = Math.max(12 - recordingIndex * 0.8, 3); // Improve with each recording

    return {
      data: {
        id: `analysis-${recordingId}`,
        userId: 'mock-user',
        recordingId,
        duration: 240,
        disfluencyCount: Math.floor(baseRate * 4), // Adjust count based on rate
        disfluencyRate: baseRate,
        disfluencies: Array.from({ length: Math.floor(baseRate * 4) }, (_, i) => ({
          id: `disfluency-${i}`,
          type: ['repetition', 'block', 'prolongation', 'interjection', 'revision'][
            Math.floor(Math.random() * 5)
          ] as DisfluencyType,
          startTime: i * 15,
          endTime: i * 15 + 2,
          confidence: 0.8 + Math.random() * 0.2,
          text: 'Mock disfluency text',
        })),
        createdAt: new Date().toISOString(),
        status: 'completed',
      },
      error: null,
    };
  }
}

export const mockApiClient = new MockApiClient();
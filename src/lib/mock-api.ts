import { ApiResponse, PaginatedResponse } from '@/types/api';
import { AudioAnalysis, UserAnalytics, DisfluencyType, EnhancedUserAnalytics } from '@/types/analytics';
import { AudioRecording, UploadProgress } from '@/types/upload';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiClient {
  private mockUserAnalytics: EnhancedUserAnalytics = {
    totalRecordings: 15,
    totalDuration: 4500,
    averageDisfluencyRate: 5.2,
    mostCommonDisfluency: 'repetition' as DisfluencyType,
    progressOverTime: Array.from({ length: 10 }, (_, i) => {
      const baseRate = 12 - (i * 0.8);
      const variation = Math.sin(i) * 0.3;
      return {
        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
        disfluencyRate: Math.max(baseRate + variation, 3),
      };
    }),
    weeklyImprovement: 15.3,
    streak: {
      current: 5,
      longest: 12,
      lastRecordingDate: new Date().toISOString()
    },
    phonemeProgress: [
      { phoneme: 's', errorRate: 12.5, totalOccurrences: 245, improvement: 25.3 },
      { phoneme: 'r', errorRate: 10.2, totalOccurrences: 189, improvement: 18.7 },
      { phoneme: 'th', errorRate: 8.7, totalOccurrences: 156, improvement: 15.2 },
      { phoneme: 'l', errorRate: 6.4, totalOccurrences: 203, improvement: 22.1 },
      { phoneme: 'f', errorRate: 5.1, totalOccurrences: 167, improvement: 28.4 }
    ],
    environmentInsights: [
      {
        type: 'noise',
        impact: -15.3,
        recommendation: 'Performance decreases in noisy environments. Try practicing in quieter settings.'
      },
      {
        type: 'time_of_day',
        impact: 12.8,
        recommendation: 'You perform best in the morning. Consider scheduling important conversations before noon.'
      },
      {
        type: 'duration',
        impact: -8.5,
        recommendation: 'Longer sessions (>10 minutes) show increased disfluency rates. Try shorter, focused practice sessions.'
      }
    ],
  };

  private generateProgressData(days: number, startRate: number, improvement: number) {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const baseRate = startRate - (improvement * (i / days));
      const variation = Math.sin(i) * 0.3;
      return {
        date: date.toISOString(),
        disfluencyRate: Math.max(baseRate + variation, 2),
      };
    });
  }

  private mockEnhancedAnalytics: EnhancedUserAnalytics = {
    totalRecordings: 15,
    totalDuration: 4500,
    averageDisfluencyRate: 5.2,
    mostCommonDisfluency: 'repetition' as DisfluencyType,
    progressOverTime: this.generateProgressData(30, 12, 7),
    weeklyImprovement: 15.3,
    streak: {
      current: 5,
      longest: 12,
      lastRecordingDate: new Date().toISOString()
    },
    goals: [
      {
        id: '1',
        type: 'disfluency_rate',
        target: 4,
        current: 5.2,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    phonemeProgress: [
      { phoneme: 's', errorRate: 12.5, totalOccurrences: 245, improvement: 25.3 },
      { phoneme: 'r', errorRate: 10.2, totalOccurrences: 189, improvement: 18.7 },
      { phoneme: 'th', errorRate: 8.7, totalOccurrences: 156, improvement: 15.2 },
      { phoneme: 'l', errorRate: 6.4, totalOccurrences: 203, improvement: 22.1 },
      { phoneme: 'f', errorRate: 5.1, totalOccurrences: 167, improvement: 28.4 }
    ],
    environmentInsights: [
      {
        type: 'noise',
        impact: -15.3,
        recommendation: 'Performance decreases in noisy environments. Try practicing in quieter settings.'
      },
      {
        type: 'time_of_day',
        impact: 12.8,
        recommendation: 'You perform best in the morning. Consider scheduling important conversations before noon.'
      },
      {
        type: 'duration',
        impact: -8.5,
        recommendation: 'Longer sessions (>10 minutes) show increased disfluency rates. Try shorter, focused practice sessions.'
      }
    ],
    timeOfDayPerformance: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      averageRate: 5 + Math.sin(i * Math.PI / 12) * 2,
      totalRecordings: Math.floor(10 + Math.sin(i * Math.PI / 12) * 5)
    }))
  };

  async getUserAnalytics(userId: string): Promise<ApiResponse<EnhancedUserAnalytics>> {
    await delay(800);
    return {
      data: this.mockEnhancedAnalytics,
      error: null
    };
  }


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
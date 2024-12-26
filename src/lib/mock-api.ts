import { ApiResponse, PaginatedResponse } from '@/types/api';
import { AudioAnalysis, UserAnalytics, DisfluencyType, EnhancedUserAnalytics } from '@/types/analytics';
import { AudioRecording, UploadProgress } from '@/types/upload';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiClient {
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

  private mockEnhancedAnalytics: EnhancedUserAnalytics = {
    // Basic metrics
    totalRecordings: 15,
    totalDuration: 4500,
    averageDisfluencyRate: 5.2,
    mostCommonDisfluency: 'repetition' as DisfluencyType,
    weeklyImprovement: 15.3,

    // Progress data
    progressOverTime: this.generateProgressData(30, 12, 7),

    // User streak info
    streak: {
      current: 5,
      longest: 12,
      lastRecordingDate: new Date().toISOString()
    },

    // User goals
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

    // Phoneme analysis
    phonemeProgress: [
      { phoneme: 's', errorRate: 12.5, totalOccurrences: 245, improvement: 25.3 },
      { phoneme: 'r', errorRate: 10.2, totalOccurrences: 189, improvement: 18.7 },
      { phoneme: 'th', errorRate: 8.7, totalOccurrences: 156, improvement: 15.2 },
      { phoneme: 'l', errorRate: 6.4, totalOccurrences: 203, improvement: 22.1 },
      { phoneme: 'f', errorRate: 5.1, totalOccurrences: 167, improvement: 28.4 }
    ],

    // Environment factors
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

    // Time-based patterns
    timeOfDayPerformance: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      averageRate: 5 + Math.sin(i * Math.PI / 12) * 2,
      totalRecordings: Math.floor(10 + Math.sin(i * Math.PI / 12) * 5)
    })),

    disfluencyPatterns: Array.from({ length: 7 * 24 }, (_, i) => ({
      hour: i % 24,
      weekday: Math.floor(i / 24),
      value: 3 + Math.random() * 5
    })),

    // Speech metrics
    speechMetrics: [
      {
        category: 'Fluency',
        score: 7.5,
        change: 15.2,
        details: [
          { label: 'Speech Rate', value: 8.0 },
          { label: 'Rhythm', value: 7.2 }
        ]
      },
      {
        category: 'Naturalness',
        score: 8.2,
        change: 12.5,
        details: [
          { label: 'Intonation', value: 8.5 },
          { label: 'Stress Patterns', value: 7.9 }
        ]
      },
      {
        category: 'Confidence',
        score: 7.8,
        change: 18.3,
        details: [
          { label: 'Voice Stability', value: 7.6 },
          { label: 'Consistency', value: 8.0 }
        ]
      }
    ],

    // Weekly highlights
    weeklyHighlights: [
      'Reduced repetitions by 25%',
      'Achieved best fluency score in morning sessions',
      'Maintained practice streak for 5 days'
    ]
  };

  // API Endpoints
  async getUserAnalytics(userId: string): Promise<ApiResponse<EnhancedUserAnalytics>> {
    await delay(800);
    return {
      data: this.mockEnhancedAnalytics,
      error: null
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
      totalBytes: chunk.size * 5,
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
    const baseRate = Math.max(12 - recordingIndex * 0.8, 3);

    return {
      data: {
        id: `analysis-${recordingId}`,
        userId: 'mock-user',
        recordingId,
        duration: 240,
        disfluencyCount: Math.floor(baseRate * 4),
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
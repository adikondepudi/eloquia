// /lib/api-client.ts
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { AudioAnalysis, UserAnalytics } from '@/types/analytics';
import { AudioRecording, UploadProgress } from '@/types/upload';

// Default to local development API URL if not specified
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        // For now, return mock data in development
        if (process.env.NODE_ENV === 'development') {
          return this.getMockData<T>(endpoint);
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Return mock data in development
      if (process.env.NODE_ENV === 'development') {
        return this.getMockData<T>(endpoint);
      }
      throw error;
    }
  }

  private getMockData<T>(endpoint: string): ApiResponse<T> {
    // Mock data based on endpoint
    if (endpoint.includes('/analytics/user')) {
      return {
        data: {
          totalRecordings: 15,
          totalDuration: 4500,
          averageDisfluencyRate: 8.5,
          mostCommonDisfluency: 'repetition',
          progressOverTime: Array.from({ length: 10 }, (_, i) => ({
            date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
            disfluencyRate: 12 - (i * 0.4) + Math.random() * 2,
          })),
        } as T,
        error: null,
      };
    }

    if (endpoint.includes('/recordings')) {
      return {
        data: Array.from({ length: 5 }, (_, i) => ({
          id: `recording-${i + 1}`,
          userId: 'mock-user',
          filename: `Recording ${i + 1}.mp3`,
          duration: 180 + Math.random() * 300,
          fileSize: 1024 * 1024 * (2 + Math.random() * 8),
          mimeType: 'audio/mpeg',
          url: '#',
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          status: 'ready',
        })) as T,
        error: null,
      };
    }

    // Default mock data
    return {
      data: {} as T,
      error: null,
    };
  }

  // Analytics endpoints
  async getAnalysis(recordingId: string): Promise<ApiResponse<AudioAnalysis>> {
    return this.fetch(`/analysis/${recordingId}`);
  }

  async getUserAnalytics(userId: string): Promise<ApiResponse<UserAnalytics>> {
    return this.fetch(`/analytics/user/${userId}`);
  }

  // Recording endpoints
  async getRecordings(userId: string): Promise<PaginatedResponse<AudioRecording[]>> {
    return {
      ...(await this.fetch(`/recordings/${userId}`)),
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      }
    };
  }

  // Upload endpoints
  async initiateUpload(file: File): Promise<ApiResponse<{ uploadId: string }>> {
    return this.fetch('/upload/initiate', {
      method: 'POST',
      body: JSON.stringify({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }),
    });
  }

  async uploadChunk(
    uploadId: string,
    chunk: Blob,
    chunkIndex: number
  ): Promise<ApiResponse<UploadProgress>> {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex.toString());

    return this.fetch(`/upload/${uploadId}/chunk`, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }
}

export const apiClient = new ApiClient();
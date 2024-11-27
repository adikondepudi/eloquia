// /lib/api-config.ts
import { apiClient as productionApiClient } from './api-client';
import { mockApiClient } from './mock-api';

// Use mock API when running locally or when real API is not available
export const apiClient = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' 
  ? mockApiClient 
  : productionApiClient;
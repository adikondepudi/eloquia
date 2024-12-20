// /lib/api-config.ts
import { apiClient as productionApiClient } from './api-client';
import { mockApiClient } from './mock-api';

// Force use mock API in development
export const apiClient = process.env.NODE_ENV === 'development' 
  ? mockApiClient 
  : productionApiClient;
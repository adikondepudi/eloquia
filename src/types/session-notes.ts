export type SessionQuality = 'excellent' | 'good' | 'fair' | 'challenging';

export interface SessionNote {
  id: string;
  clientId: string;
  therapistId: string;
  date: string;
  duration: number;  // in minutes
  primaryFocus: string;
  observations: string;
  quality: SessionQuality;
  progress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionNoteInput {
  clientId: string;
  therapistId: string;
  date: string;
  duration: number;
  primaryFocus: string;
  observations: string;
  quality: SessionQuality;
  progress: string;
}
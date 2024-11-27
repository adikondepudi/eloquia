// /types/analytics.ts
/** Represents types of speech disfluencies that can be detected */
export type DisfluencyType = 
  | 'repetition'
  | 'prolongation'
  | 'block'
  | 'interjection'
  | 'revision';

/** Represents a single detected disfluency instance */
export interface DisfluencyInstance {
  id: string;
  type: DisfluencyType;
  startTime: number;
  endTime: number;
  confidence: number;
  text: string;
}

/** Represents a complete analysis of an audio recording */
export interface AudioAnalysis {
  id: string;
  userId: string;
  recordingId: string;
  duration: number;
  disfluencyCount: number;
  disfluencyRate: number;
  disfluencies: DisfluencyInstance[];
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/** Represents aggregated analytics for a user's recordings */
export interface UserAnalytics {
  totalRecordings: number;
  totalDuration: number;
  averageDisfluencyRate: number;
  mostCommonDisfluency: DisfluencyType;
  progressOverTime: {
    date: string;
    disfluencyRate: number;
  }[];
}

// /types/analytics.ts

/** Represents types of speech disfluencies that can be detected */
export type DisfluencyType = 
  | 'repetition'
  | 'prolongation'
  | 'block'
  | 'interjection'
  | 'revision';

export type TimeRange = 'week' | 'month' | 'all';

/** Represents a single detected disfluency instance */
export interface DisfluencyInstance {
  id: string;
  type: DisfluencyType;
  startTime: number;
  endTime: number;
  confidence: number;
  text: string;
}

export interface PhonemeAnalysis {
  phoneme: string;
  errorRate: number;
  totalOccurrences: number;
  improvement: number;
}

export interface EnvironmentFactor {
  type: 'noise' | 'time_of_day' | 'duration';
  impact: number;
  recommendation: string;
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

/** Represents a user's practice streak */
export interface UserStreak {
  current: number;
  longest: number;
  lastRecordingDate: string;
}

/** Represents a user goal */
export interface UserGoal {
  id: string;
  type: 'disfluency_rate' | 'recording_streak' | 'total_duration';
  target: number;
  current: number;
  deadline: string;
  startDate: string;
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

/** Enhanced analytics with additional metrics and insights */
export interface EnhancedUserAnalytics extends UserAnalytics {
  weeklyImprovement: number;
  streak: UserStreak;
  goals?: UserGoal[];
  phonemeProgress: PhonemeAnalysis[];
  environmentInsights: EnvironmentFactor[];
  timeOfDayPerformance?: {
    hour: number;
    averageRate: number;
    totalRecordings: number;
  }[];
}
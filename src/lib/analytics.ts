// /lib/analytics.ts
import { DisfluencyInstance, AudioAnalysis } from '@/types/analytics';

export const calculateDisfluencyRate = (
  disfluencies: DisfluencyInstance[],
  duration: number
): number => {
  return (disfluencies.length / duration) * 60; // Disfluencies per minute
};

export const groupDisfluenciesByType = (
  disfluencies: DisfluencyInstance[]
): Record<string, number> => {
  return disfluencies.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const calculateProgress = (
  currentAnalysis: AudioAnalysis,
  previousAnalysis: AudioAnalysis
): number => {
  const currentRate = calculateDisfluencyRate(
    currentAnalysis.disfluencies,
    currentAnalysis.duration
  );
  const previousRate = calculateDisfluencyRate(
    previousAnalysis.disfluencies,
    previousAnalysis.duration
  );

  return ((previousRate - currentRate) / previousRate) * 100;  
};

// /types/analytics.ts

export type DisfluencyType = 
  | 'repetition'
  | 'prolongation'
  | 'block'
  | 'interjection'
  | 'revision';

export type TimeRange = 'week' | 'month' | 'all';

export interface PhonemeAnalysis {
  phoneme: string;
  errorRate: number;
  totalOccurrences: number;
  improvement: number;
}

export interface SectionAnalysis {
  startTime: number;
  endTime: number;
  disfluencyRate: number;
  phonemeErrors: PhonemeAnalysis[];
}

export interface EnvironmentFactor {
  type: 'noise' | 'time_of_day' | 'duration';
  impact: number;
  recommendation: string;
}

export interface RecordingAnalysis extends AudioAnalysis {
  phonemeAnalysis: PhonemeAnalysis[];
  sectionAnalysis: SectionAnalysis[];
  environmentFactors: EnvironmentFactor[];
}

export interface UserGoal {
  id: string;
  type: 'disfluency_rate' | 'recording_streak' | 'total_duration';
  target: number;
  current: number;
  deadline: string;
  startDate: string;
}

export interface UserStreak {
  current: number;
  longest: number;
  lastRecordingDate: string;
}

export interface EnhancedUserAnalytics extends UserAnalytics {
  weeklyImprovement: number;
  streak: UserStreak;
  goals: UserGoal[];
  phonemeProgress: PhonemeAnalysis[];
  environmentInsights: EnvironmentFactor[];
  timeOfDayPerformance: {
    hour: number;
    averageRate: number;
    totalRecordings: number;
  }[];
}
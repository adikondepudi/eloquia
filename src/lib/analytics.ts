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
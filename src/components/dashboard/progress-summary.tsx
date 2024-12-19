import { MetricsCard } from "@/components/dashboard/metrics-card";

interface ProgressSummaryProps {
  weeklyImprovement: number;
  streak: {
    current: number;
    longest: number;
  };
  totalRecordings: number;
  averageRate: number;
}

export const ProgressSummary = ({
  weeklyImprovement,
  streak,
  totalRecordings,
  averageRate,
}: ProgressSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Weekly Progress"
        value={`${weeklyImprovement > 0 ? '+' : ''}${weeklyImprovement}%`}
        description="Improvement from last week"
      />
      <MetricsCard
        title="Current Streak"
        value={`${streak.current} days`}
        description={`Longest: ${streak.longest} days`}
      />
      <MetricsCard
        title="Total Recordings"
        value={totalRecordings.toString()}
        description="All-time recordings"
      />
      <MetricsCard
        title="Average Rate"
        value={`${averageRate.toFixed(1)}/min`}
        description="Current disfluency rate"
      />
    </div>
  );
};

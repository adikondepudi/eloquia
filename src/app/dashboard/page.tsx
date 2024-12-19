// /app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EnhancedAnalyticsChart } from "@/components/dashboard/enhanced-analytics-chart";
import { ProgressSummary } from "@/components/dashboard/progress-summary";
import { PhonemeAnalysisCard } from "@/components/dashboard/phoneme-analysis";
import { EnvironmentInsights } from "@/components/dashboard/environment-insights";
import { apiClient } from "@/lib/api-config";
import { EnhancedUserAnalytics, TimeRange } from "@/types/analytics";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [analytics, setAnalytics] = useState<EnhancedUserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [showBenchmark, setShowBenchmark] = useState(false);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiClient.getUserAnalytics(user.id);
        setAnalytics(response.data as EnhancedUserAnalytics);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);
  
  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }
  
  if (!isSignedIn) {
    redirect("/sign-in");
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderSkeleton = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  );

  if (isLoading || !analytics) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {renderSkeleton()}
      </div>
    );
  }

  const filteredData = analytics.progressOverTime.filter(point => {
    const date = new Date(point.date);
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return date >= new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return date >= new Date(now.setMonth(now.getMonth() - 1));
      default:
        return true;
    }
  });

  const chartData = filteredData.map(point => ({
    ...point,
    benchmark: showBenchmark ? point.disfluencyRate * 1.2 : undefined,
  }));

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <ProgressSummary
        weeklyImprovement={analytics.weeklyImprovement}
        streak={analytics.streak}
        totalRecordings={analytics.totalRecordings}
        averageRate={analytics.averageDisfluencyRate}
      />

      <EnhancedAnalyticsChart
        data={chartData}
        onTimeRangeChange={setTimeRange}
        timeRange={timeRange}
        showBenchmark={showBenchmark}
        onToggleBenchmark={() => setShowBenchmark(!showBenchmark)}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <PhonemeAnalysisCard phonemes={analytics.phonemeProgress} />
        <EnvironmentInsights factors={analytics.environmentInsights} />
      </div>
    </div>
  );
}
// /app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { RecentUploads } from "@/components/dashboard/recent-uploads";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { apiClient } from "@/lib/api-config";
import { UserAnalytics } from "@/types/analytics";
import { AudioRecording } from "@/types/upload";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const [analyticsResponse, recordingsResponse] = await Promise.all([
          apiClient.getUserAnalytics(user.id),
          apiClient.getRecordings(user.id)
        ]);

        setAnalytics(analyticsResponse.data);
        setRecordings(recordingsResponse.data);
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

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricsCard 
          title="Total Recordings"
          value={analytics?.totalRecordings.toString() ?? '-'}
          description="Audio files analyzed"
          isLoading={isLoading}
        />
        <MetricsCard 
          title="Total Duration"
          value={analytics ? `${Math.round(analytics.totalDuration / 60)} min` : '-'}
          description="Total recording time"
          isLoading={isLoading}
        />
        <MetricsCard 
          title="Average Disfluency Rate"
          value={analytics ? `${analytics.averageDisfluencyRate.toFixed(1)}/min` : '-'}
          description="Disfluencies per minute"
          isLoading={isLoading}
        />
      </div>

      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.progressOverTime} />
          </CardContent>
        </Card>
      )}

      <RecentUploads recordings={recordings} isLoading={isLoading} />
    </div>
  );
}
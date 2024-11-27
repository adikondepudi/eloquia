// /app/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { apiClient } from "@/lib/api-config";
import { UserAnalytics } from "@/types/analytics";

export default function AnalyticsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiClient.getUserAnalytics(user.id);
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load analytics data. Please try again later.');
        console.error('Analytics fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchAnalytics();
    }
  }, [user?.id]);

  if (!isLoaded) {
    return null;
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
    <div className="space-y-4">
      <div className="h-32 bg-muted rounded-lg animate-pulse" />
      <div className="h-64 bg-muted rounded-lg animate-pulse" />
    </div>
  );

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {isLoading ? (
        renderSkeleton()
      ) : analytics ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Recordings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.totalRecordings}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(analytics.totalDuration / 60)} minutes
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg. Disfluency Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.averageDisfluencyRate.toFixed(2)}/min
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Common</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {analytics.mostCommonDisfluency}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AnalyticsChart data={analytics.progressOverTime} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
// /app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedAnalyticsChart } from "@/components/dashboard/enhanced-analytics-chart";
import { ProgressSummary } from "@/components/dashboard/progress-summary";
import { PhonemeAnalysisCard } from "@/components/dashboard/phoneme-analysis";
import { EnhancedEnvironmentInsights } from "@/components/dashboard/enhanced-environment-insights";
import { DisfluencyHeatmap } from "@/components/dashboard/disfluency-heatmap";
import { SpeechNaturalness } from "@/components/dashboard/speech-naturalness";
import { apiClient } from "@/lib/api-config";
import { EnhancedUserAnalytics, TimeRange } from "@/types/analytics";
import { triggerConfetti } from '@/lib/confetti';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [analytics, setAnalytics] = useState<EnhancedUserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [previousStreak, setPreviousStreak] = useState(0);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiClient.getUserAnalytics(user.id);
        const newData = response.data as EnhancedUserAnalytics;
        
        // Check if streak has increased
        if (analytics && newData.streak.current > previousStreak) {
          triggerConfetti();
        }
        
        setPreviousStreak(newData.streak.current);
        setAnalytics(newData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
      // Refresh data every 5 minutes
      const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user?.id, analytics, previousStreak]);
  
  if (!isLoaded) {
    return (
      <motion.div 
        className="p-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
      >
        Loading...
      </motion.div>
    );
  }
  
  if (!isSignedIn) {
    redirect("/sign-in");
  }

  if (error) {
    return (
      <motion.div 
        className="p-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
      >
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  const renderSkeleton = () => (
    <motion.div 
      className="space-y-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="h-16 w-64 bg-muted rounded animate-pulse" />
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
      <div className="h-64 bg-muted rounded-lg animate-pulse" />
      <div className="h-96 bg-muted rounded-lg animate-pulse" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    </motion.div>
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
    <AnimatePresence>
      <motion.div 
        className="container mx-auto p-8 space-y-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
      >
        {/* Hero Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {getGreeting()}, {user?.firstName || 'there'}!
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {format(new Date(), "EEEE, MMMM do, yyyy")}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProgressSummary
            weeklyImprovement={analytics.weeklyImprovement}
            streak={analytics.streak}
            totalRecordings={analytics.totalRecordings}
            averageRate={analytics.averageDisfluencyRate}
          />
        </motion.div>

        {/* Main Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EnhancedAnalyticsChart
            data={chartData}
            onTimeRangeChange={setTimeRange}
            timeRange={timeRange}
            showBenchmark={showBenchmark}
            onToggleBenchmark={() => setShowBenchmark(!showBenchmark)}
          />
        </motion.div>

        {/* Analysis Cards */}
        <motion.div 
          className="grid gap-8 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <PhonemeAnalysisCard phonemes={analytics.phonemeProgress} />
          <EnhancedEnvironmentInsights factors={analytics.environmentInsights} />
        </motion.div>

        {/* Time of Day Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.timeOfDayPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) => `${hour}:00`}
                      className="text-sm"
                    />
                    <YAxis
                      label={{
                        value: 'Disfluency Rate',
                        angle: -90,
                        position: 'insideLeft',
                        className: 'text-sm'
                      }}
                      className="text-sm"
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(1)} per minute`, 'Rate']}
                      labelFormatter={(hour) => `${hour}:00`}
                      contentStyle={{
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageRate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disfluency Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <DisfluencyHeatmap
            data={analytics.disfluencyPatterns || []}
            onViewChange={(view) => setTimeRange(view)}
            currentView={timeRange}
          />
        </motion.div>

        {/* Speech Metrics and Weekly Summary */}
        <motion.div 
          className="grid gap-8 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <SpeechNaturalness metrics={analytics.speechMetrics || []} />
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <p className="text-muted-foreground">
                  This week you've improved your speech naturalness by{' '}
                  <span className="font-medium text-primary">
                    {analytics.weeklyImprovement}%
                  </span>
                </p>
                {analytics.weeklyHighlights?.map((highlight, index) => (
                  <div key={index} className="text-sm">
                    • {highlight}
                  </div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
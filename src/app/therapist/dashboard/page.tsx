// /src/app/therapist/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientList } from "@/components/therapist/client-list";
import { UpcomingSessions } from "@/components/therapist/upcoming-sessions";
import { RecentActivities } from "@/components/therapist/recent-activities";
import { mockTherapistApiClient } from '@/lib/mock-therapist-api';
import { TherapistDashboardData } from '@/types/therapist';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export default function TherapistDashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [dashboardData, setDashboardData] = useState<TherapistDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await mockTherapistApiClient.getTherapistDashboard(user.id);
        setDashboardData(response.data);
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
  }, [user?.id]);

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
      <div className="h-[600px] bg-muted rounded-lg animate-pulse" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
        <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
      </div>
    </motion.div>
  );

  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
        {renderSkeleton()}
      </div>
    );
  }

  return (
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
              Welcome back, {dashboardData.profile.firstName}!
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

      {/* Overview Stats */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.profile.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.profile.activeClients} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.upcomingSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {dashboardData.upcomingSessions[0]?.clientName || 'None scheduled'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.recentActivities.length}</div>
            <p className="text-xs text-muted-foreground">in the last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.profile.specializations.length}</div>
            <p className="text-xs text-muted-foreground">areas of focus</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Client List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ClientList clients={dashboardData.clientSummaries} />
      </motion.div>

      {/* Side Panels */}
      <motion.div
        className="grid gap-8 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <UpcomingSessions sessions={dashboardData.upcomingSessions} />
        <RecentActivities activities={dashboardData.recentActivities} />
      </motion.div>
    </motion.div>
  );
}
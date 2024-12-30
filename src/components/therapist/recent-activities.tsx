// /src/components/therapist/recent-activities.tsx
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Activity, FileText, Mic, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TherapistDashboardData } from '@/types/therapist';

interface RecentActivitiesProps {
  activities: TherapistDashboardData['recentActivities'];
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note_added':
        return <FileText className="h-4 w-4" />;
      case 'recording_reviewed':
        return <Mic className="h-4 w-4" />;
      case 'goal_completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'session_completed':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <Link
                      href={`/therapist/clients/${activity.clientId}`}
                      className="hover:underline"
                    >
                      {activity.clientName}
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
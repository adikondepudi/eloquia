// /src/components/therapist/upcoming-sessions.tsx
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TherapistDashboardData } from '@/types/therapist';

interface UpcomingSessionsProps {
  sessions: TherapistDashboardData['upcomingSessions'];
}

export const UpcomingSessions = ({ sessions }: UpcomingSessionsProps) => {
  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'evaluation':
        return 'bg-blue-500/15 text-blue-700 border-blue-600/20';
      case 'followup':
        return 'bg-purple-500/15 text-purple-700 border-purple-600/20';
      default:
        return 'bg-green-500/15 text-green-700 border-green-600/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Sessions</CardTitle>
          <Button variant="outline" size="sm">
            View Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No upcoming sessions</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={`${session.clientId}-${session.date}`}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <Link
                    href={`/therapist/clients/${session.clientId}`}
                    className="font-medium hover:underline"
                  >
                    {session.clientName}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getSessionTypeColor(session.type)}>
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(session.date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/therapist/clients/${session.clientId}`}>
                    View Client
                  </Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
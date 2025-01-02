// /src/app/therapist/clients/[clientId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ClientProfile, TherapyGoal, Recording } from '@/types/enhanced-client';
import { enhancedMockApiClient } from '@/lib/enhanced-mock-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientProfileSection } from '@/components/client/client-profile-section';
import { ClientGoalsSection } from '@/components/client/client-goals-section';
import { ClientRecordingsSection } from '@/components/client/client-recordings-section';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionNotesSection } from '@/components/client/session-notes-section';
import { SessionNote } from '@/types/session-notes';

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [goals, setGoals] = useState<TherapyGoal[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || typeof clientId !== 'string') return;

      try {
        setIsLoading(true);
        setError(null);

        const [clientResponse, goalsResponse, recordingsResponse] = await Promise.all([
          enhancedMockApiClient.getClientProfile(clientId),
          enhancedMockApiClient.getClientGoals(clientId),
          enhancedMockApiClient.getClientRecordings(clientId),
          enhancedMockApiClient.getClientNotes(clientId)
        ]);

        if (clientResponse.error) {
          throw new Error(clientResponse.error.message);
        }

        setClient(clientResponse.data);
        setGoals(goalsResponse.data);
        setRecordings(recordingsResponse.data);
        setSessionNotes(notesResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load client data');
        console.error('Error fetching client data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !client) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {client.firstName} {client.lastName}
        </h1>
        <p className="text-muted-foreground">
          Client since {format(new Date(client.startDate), 'MMMM d, yyyy')}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="notes">Session Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ClientProfileSection 
            client={client}
            onUpdate={async (updates) => {
              // Handle profile updates
              console.log('Updating profile:', updates);
            }}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <ClientGoalsSection
            goals={goals}
            onAddGoal={async (goal) => {
              if (!clientId || typeof clientId !== 'string') return;
              const response = await enhancedMockApiClient.addClientGoal(clientId, goal);
              if (!response.error) {
                setGoals([...goals, response.data]);
              }
            }}
            onUpdateGoal={async (goalId, updates) => {
              const response = await enhancedMockApiClient.updateClientGoal(goalId, updates);
              if (!response.error) {
                setGoals(goals.map(g => g.id === goalId ? response.data : g));
              }
            }}
          />
        </TabsContent>

        <TabsContent value="recordings" className="space-y-6">
          <ClientRecordingsSection
            clientId={client.id}
            recordings={recordings}
            onRecordingUpdate={(recordingId) => {
              // Refresh recordings after update
              if (!clientId || typeof clientId !== 'string') return;
              enhancedMockApiClient.getClientRecordings(clientId).then(response => {
                if (!response.error) {
                  setRecordings(response.data);
                }
              });
            }}
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <SessionNotesSection
            clientId={clientId as string}
            therapistId="th_1"
            notes={sessionNotes}
            onNoteCreate={async (note) => {
              const response = await enhancedMockApiClient.addSessionNote(note);
              if (!response.error) {
                setSessionNotes([response.data, ...sessionNotes]);
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
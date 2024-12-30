// /src/lib/mock-therapist-api.ts
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { 
  TherapistProfile, 
  Client, 
  SessionNote, 
  RecordingAnnotation,
  TherapistDashboardData 
} from '@/types/therapist';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockTherapistApiClient {
  private mockTherapist: TherapistProfile = {
    id: 'th_1',
    userId: 'user_1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@eloquia.com',
    specializations: ['Fluency Disorders', 'Voice Disorders', 'Childhood Speech'],
    totalClients: 15,
    activeClients: 12
  };

  private mockClients: Client[] = Array.from({ length: 8 }, (_, i) => ({
    id: `client_${i + 1}`,
    firstName: ['James', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'Alexander', 'Isabella'][i],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i],
    email: `client${i + 1}@example.com`,
    dateOfBirth: new Date(1990 + i, i % 12, (i + 1) * 2).toISOString(),
    startDate: new Date(2023, i % 12, (i + 1) * 3).toISOString(),
    status: ['active', 'active', 'active', 'inactive', 'active', 'pending', 'active', 'active'][i] as any,
    lastSession: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    nextSession: new Date(Date.now() + ((i + 1) * 24 * 60 * 60 * 1000)).toISOString(),
    diagnosis: ['Stuttering', 'Cluttering', 'Mixed fluency disorder'][i % 3],
    goals: [
      {
        id: `goal_${i}_1`,
        description: 'Reduce blocking frequency in conversational speech',
        status: ['in_progress', 'completed', 'not_started'][i % 3] as any,
        targetDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString()
      },
      {
        id: `goal_${i}_2`,
        description: 'Implement breathing techniques in stressful situations',
        status: ['in_progress', 'not_started', 'completed'][i % 3] as any,
        targetDate: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString()
      }
    ],
    recentProgress: {
      weeklyChange: (Math.random() * 20) - 10,
      monthlyChange: (Math.random() * 30) - 15,
      averageDisfluencyRate: Math.max(2, 10 - (i * 0.8))
    }
  }));

  private mockNotes: SessionNote[] = this.mockClients.flatMap((client, i) => 
    Array.from({ length: 3 }, (_, j) => ({
      id: `note_${i}_${j}`,
      clientId: client.id,
      therapistId: this.mockTherapist.id,
      date: new Date(Date.now() - (j * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      content: `Progress note for ${client.firstName}. Session focused on ${
        ['breathing techniques', 'voluntary stuttering', 'speech rate control'][j % 3]
      }.`,
      type: ['session', 'evaluation', 'progress_note'][j % 3] as any,
      tags: ['fluency', 'technique_practice', 'progress_review'].slice(0, j + 1),
      nextSteps: [
        'Practice breathing exercises daily',
        'Record conversations in social settings',
        'Review progress in next session'
      ]
    }))
  );

  private mockAnnotations: RecordingAnnotation[] = this.mockClients.flatMap((client, i) => 
    Array.from({ length: 5 }, (_, j) => ({
      id: `annotation_${i}_${j}`,
      recordingId: `recording_${i}_${j}`,
      therapistId: this.mockTherapist.id,
      timestamp: j * 30,
      content: `Observed ${
        ['block on initial /p/', 'good recovery technique', 'natural pause used effectively'][j % 3]
      }`,
      type: ['observation', 'feedback', 'technique', 'milestone'][j % 4] as any,
      tags: ['technique', 'progress', 'milestone'].slice(0, j % 3 + 1)
    }))
  );

  async getTherapistDashboard(therapistId: string): Promise<ApiResponse<TherapistDashboardData>> {
    await delay(800);

    const upcomingSessions = this.mockClients
      .filter(client => client.nextSession)
      .slice(0, 5)
      .map(client => ({
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        date: client.nextSession!,
        type: ['regular', 'evaluation', 'followup'][Math.floor(Math.random() * 3)] as any
      }));

    const recentActivities = this.mockClients.slice(0, 10).map((client, i) => ({
      id: `activity_${i}`,
      type: ['note_added', 'recording_reviewed', 'goal_completed', 'session_completed'][i % 4] as any,
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      date: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString(),
      description: [
        'Added session notes',
        'Reviewed latest recording',
        'Completed fluency goal',
        'Completed therapy session'
      ][i % 4]
    }));

    return {
      data: {
        profile: this.mockTherapist,
        upcomingSessions,
        recentActivities,
        clientSummaries: this.mockClients
      },
      error: null
    };
  }

  async getClientDetails(clientId: string): Promise<ApiResponse<Client>> {
    await delay(600);
    const client = this.mockClients.find(c => c.id === clientId);
    if (!client) {
      return {
        data: null as any,
        error: {
          code: 'NOT_FOUND',
          message: 'Client not found'
        }
      };
    }
    return {
      data: client,
      error: null
    };
  }

  async getClientNotes(clientId: string): Promise<PaginatedResponse<SessionNote[]>> {
    await delay(500);
    const notes = this.mockNotes.filter(note => note.clientId === clientId);
    return {
      data: notes,
      error: null,
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: notes.length,
        itemsPerPage: 10
      }
    };
  }

  async getRecordingAnnotations(recordingId: string): Promise<ApiResponse<RecordingAnnotation[]>> {
    await delay(400);
    const annotations = this.mockAnnotations.filter(a => a.recordingId === recordingId);
    return {
      data: annotations,
      error: null
    };
  }

  async addAnnotation(annotation: Omit<RecordingAnnotation, 'id'>): Promise<ApiResponse<RecordingAnnotation>> {
    await delay(300);
    const newAnnotation = {
      ...annotation,
      id: `annotation_${Date.now()}`
    };
    this.mockAnnotations.push(newAnnotation);
    return {
      data: newAnnotation,
      error: null
    };
  }

  async updateAnnotation(
    annotationId: string, 
    updates: Partial<RecordingAnnotation>
  ): Promise<ApiResponse<RecordingAnnotation>> {
    await delay(300);
    const index = this.mockAnnotations.findIndex(a => a.id === annotationId);
    if (index === -1) {
      return {
        data: null as any,
        error: {
          code: 'NOT_FOUND',
          message: 'Annotation not found'
        }
      };
    }
    this.mockAnnotations[index] = {
      ...this.mockAnnotations[index],
      ...updates
    };
    return {
      data: this.mockAnnotations[index],
      error: null
    };
  }
}

export const mockTherapistApiClient = new MockTherapistApiClient();
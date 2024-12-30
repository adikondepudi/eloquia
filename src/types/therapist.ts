// /src/types/therapist.ts

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    startDate: string;
    status: 'active' | 'inactive' | 'pending';
    lastSession?: string;
    nextSession?: string;
    diagnosis?: string;
    goals?: {
      id: string;
      description: string;
      status: 'in_progress' | 'completed' | 'not_started';
      targetDate: string;
    }[];
    recentProgress: {
      weeklyChange: number;
      monthlyChange: number;
      averageDisfluencyRate: number;
    };
  }
  
  export interface TherapistProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    specializations: string[];
    totalClients: number;
    activeClients: number;
  }
  
  export interface SessionNote {
    id: string;
    clientId: string;
    therapistId: string;
    date: string;
    content: string;
    type: 'session' | 'evaluation' | 'progress_note';
    tags: string[];
    nextSteps?: string[];
  }
  
  export interface RecordingAnnotation {
    id: string;
    recordingId: string;
    therapistId: string;
    timestamp: number;
    content: string;
    type: 'observation' | 'feedback' | 'technique' | 'milestone';
    tags: string[];
  }
  
  export interface TherapistDashboardData {
    profile: TherapistProfile;
    upcomingSessions: {
      clientId: string;
      clientName: string;
      date: string;
      type: 'regular' | 'evaluation' | 'followup';
    }[];
    recentActivities: {
      id: string;
      type: 'note_added' | 'recording_reviewed' | 'goal_completed' | 'session_completed';
      clientId: string;
      clientName: string;
      date: string;
      description: string;
    }[];
    clientSummaries: Client[];
  }
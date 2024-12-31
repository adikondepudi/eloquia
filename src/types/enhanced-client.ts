// /src/types/enhanced-client.ts

export interface ClientProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    startDate: string;
    status: 'active' | 'inactive' | 'pending';
    diagnosis: string;
    assignedTherapistId: string;
    medicalHistory: string[];
    insuranceInfo: {
      provider: string;
      policyNumber: string;
      groupNumber: string;
    };
  }
  
  export interface TherapyGoal {
    id: string;
    clientId: string;
    description: string;
    category: 'fluency' | 'articulation' | 'voice' | 'language' | 'other';
    status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
    targetDate: string;
    createdAt: string;
    updatedAt: string;
    progress: number;
    notes: string[];
  }
  
  export interface Recording {
    id: string;
    clientId: string;
    title: string;
    description: string;
    uploadedAt: string;
    duration: number;
    fileSize: number;
    fileUrl: string;
    transcription?: string;
    status: 'processing' | 'ready' | 'error';
    metadata: {
      device: string;
      environment: string;
      settings: Record<string, unknown>;
    };
    analysisResults?: {
      disfluencyRate: number;
      confidenceScore: number;
      improvements: string[];
      areas_of_concern: string[];
    };
  }
  
  export interface Annotation {
    id: string;
    recordingId: string;
    therapistId: string;
    timestamp: number;
    content: string;
    type: 'observation' | 'feedback' | 'technique' | 'milestone';
    category: 'fluency' | 'articulation' | 'voice' | 'other';
    severity?: 'low' | 'medium' | 'high';
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export type ClientSummary = ClientProfile & {
    goals: TherapyGoal[];
  };
  
  export interface ClientAnalytics {
    totalRecordings: number;
    totalSessionTime: number;
    averageDisfluencyRate: number;
    progressByCategory: Record<string, number>;
    recentProgress: {
      weeklyChange: number;
      monthlyChange: number;
      longtermTrend: 'improving' | 'stable' | 'declining';
    };
  }
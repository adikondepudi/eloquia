// /src/lib/enhanced-mock-api.ts
import { format, subDays, addDays } from 'date-fns';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { SessionNote, CreateSessionNoteInput } from '@/types/session-notes';

// Enhanced interfaces for detailed client data
interface ClientProfile {
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

interface TherapyGoal {
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

interface Recording {
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

interface Annotation {
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

// Mock data generation helpers
const generateMockAddress = () => ({
  street: ['123 Main St', '456 Oak Ave', '789 Pine Rd'][Math.floor(Math.random() * 3)],
  city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
  state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
  zipCode: Math.floor(10000 + Math.random() * 90000).toString()
});

const generateMockGoals = (clientId: string): TherapyGoal[] => {
  const categories: Array<'fluency' | 'articulation' | 'voice' | 'language' | 'other'> = 
    ['fluency', 'articulation', 'voice', 'language', 'other'];
  
  return Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, index) => ({
    id: `goal_${clientId}_${index}`,
    clientId,
    description: [
      'Reduce blocking frequency in conversational speech',
      'Implement breathing techniques in stressful situations',
      'Maintain fluent speech in professional settings',
      'Improve voice projection and clarity',
      'Develop confidence in public speaking'
    ][index % 5],
    category: categories[Math.floor(Math.random() * categories.length)],
    status: ['not_started', 'in_progress', 'completed', 'in_progress'][Math.floor(Math.random() * 4)] as any,
    targetDate: format(addDays(new Date(), 30 + Math.floor(Math.random() * 60)), 'yyyy-MM-dd'),
    createdAt: format(subDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    progress: Math.floor(Math.random() * 100),
    notes: [
      'Good progress in controlled environments',
      'Needs more practice in social situations',
      'Showing improvement in technique application'
    ]
  }));
};

const generateMockRecordings = (clientId: string): Recording[] => {
  return Array.from({ length: 5 + Math.floor(Math.random() * 5) }, (_, index) => ({
    id: `recording_${clientId}_${index}`,
    clientId,
    title: `Session Recording ${index + 1}`,
    description: `Practice session focusing on ${['breathing techniques', 'conversation skills', 'public speaking', 'reading exercises'][Math.floor(Math.random() * 4)]}`,
    uploadedAt: format(subDays(new Date(), index), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    duration: 300 + Math.floor(Math.random() * 900), // 5-20 minutes
    fileSize: 1024 * 1024 * (2 + Math.floor(Math.random() * 8)), // 2-10 MB
    fileUrl: `/mock-recordings/${clientId}/${index}.mp3`,
    status: 'ready',
    metadata: {
      device: ['iPhone', 'Android', 'Desktop', 'Tablet'][Math.floor(Math.random() * 4)],
      environment: ['quiet', 'moderate noise', 'busy'][Math.floor(Math.random() * 3)],
      settings: {
        noiseReduction: true,
        enhancedClarity: true
      }
    },
    analysisResults: {
      disfluencyRate: 2 + Math.random() * 8,
      confidenceScore: 0.7 + Math.random() * 0.3,
      improvements: ['Reduced blocks', 'Better breathing control'],
      areas_of_concern: ['Initial consonants', 'Fast-paced speech']
    }
  }));
};

const generateMockAnnotations = (recordingId: string, therapistId: string): Annotation[] => {
  const annotationTypes: Array<'observation' | 'feedback' | 'technique' | 'milestone'> = 
    ['observation', 'feedback', 'technique', 'milestone'];
  
  return Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, index) => ({
    id: `annotation_${recordingId}_${index}`,
    recordingId,
    therapistId,
    timestamp: Math.floor(Math.random() * 300), // Random timestamp within first 5 minutes
    content: [
      'Good use of breathing technique',
      'Notice tension in jaw area',
      'Successfully implemented pause-and-plan strategy',
      'Excellent recovery from block',
      'Consider slowing down speech rate here',
      'Great improvement in fluency during this section'
    ][Math.floor(Math.random() * 6)],
    type: annotationTypes[Math.floor(Math.random() * annotationTypes.length)],
    category: ['fluency', 'articulation', 'voice', 'other'][Math.floor(Math.random() * 4)] as any,
    severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    tags: ['technique', 'progress', 'breathing', 'tension', 'rate'].slice(0, 1 + Math.floor(Math.random() * 4)),
    createdAt: format(subDays(new Date(), Math.floor(Math.random() * 7)), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")
  }));
};

// Generate initial mock data
const mockClients: ClientProfile[] = Array.from({ length: 10 }, (_, index) => ({
  id: `client_${index + 1}`,
  firstName: ['James', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'Alexander', 'Isabella', 'Ethan', 'Ava'][index],
  lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][index],
  email: `client${index + 1}@example.com`,
  dateOfBirth: format(subDays(new Date(), 7300 + Math.floor(Math.random() * 3650)), 'yyyy-MM-dd'),
  gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as any,
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  address: generateMockAddress(),
  emergencyContact: {
    name: ['John Smith', 'Mary Johnson', 'Robert Wilson'][Math.floor(Math.random() * 3)],
    relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)],
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
  },
  startDate: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
  status: ['active', 'active', 'active', 'inactive', 'pending'][Math.floor(Math.random() * 5)] as any,
  diagnosis: ['Developmental stuttering', 'Neurogenic stuttering', 'Mixed fluency disorder'][Math.floor(Math.random() * 3)],
  assignedTherapistId: 'th_1',
  medicalHistory: [
    'No significant medical history',
    'Anxiety disorder',
    'Previous speech therapy'
  ],
  insuranceInfo: {
    provider: ['Blue Cross', 'Aetna', 'UnitedHealth', 'Cigna'][Math.floor(Math.random() * 4)],
    policyNumber: `POL${Math.floor(Math.random() * 1000000)}`,
    groupNumber: `GRP${Math.floor(Math.random() * 100000)}`
  }
}));

class EnhancedMockApiClient {
  private clients: ClientProfile[] = mockClients;

  private goals: Map<string, TherapyGoal[]> = new Map(
    mockClients.map(client => [client.id, generateMockGoals(client.id)])
  );
  private recordings: Map<string, Recording[]> = new Map(
    mockClients.map(client => [client.id, generateMockRecordings(client.id)])
  );
  private annotations: Map<string, Annotation[]> = new Map();

  constructor() {
    // Initialize annotations for each recording
    this.recordings.forEach((clientRecordings, clientId) => {
      clientRecordings.forEach(recording => {
        this.annotations.set(
          recording.id,
          generateMockAnnotations(recording.id, 'th_1')
        );
      });
    });
  }

  async getClientProfile(clientId: string): Promise<ApiResponse<ClientProfile>> {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    const client = this.clients.find(c => c.id === clientId);
    
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

  async getClientGoals(clientId: string): Promise<ApiResponse<TherapyGoal[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      data: this.goals.get(clientId) || [],
      error: null
    };
  }

  private sessionNotes: Map<string, SessionNote[]> = new Map();

  async getClientNotes(clientId: string): Promise<ApiResponse<SessionNote[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      data: this.sessionNotes.get(clientId) || [],
      error: null
    };
  }

  async addSessionNote(note: CreateSessionNoteInput): Promise<ApiResponse<SessionNote>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newNote: SessionNote = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const clientNotes = this.sessionNotes.get(note.clientId) || [];
    this.sessionNotes.set(note.clientId, [newNote, ...clientNotes]);

    return {
      data: newNote,
      error: null
    };
  }

  async getClientRecordings(
    clientId: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Recording[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const recordings = this.recordings.get(clientId) || [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: recordings.slice(start, end),
      error: null,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(recordings.length / pageSize),
        totalItems: recordings.length,
        itemsPerPage: pageSize
      }
    };
  }

  async getRecordingAnnotations(recordingId: string): Promise<ApiResponse<Annotation[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      data: this.annotations.get(recordingId) || [],
      error: null
    };
  }

  async addAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Annotation>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newAnnotation: Annotation = {
      ...annotation,
      id: `annotation_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const recordingAnnotations = this.annotations.get(annotation.recordingId) || [];
    this.annotations.set(annotation.recordingId, [...recordingAnnotations, newAnnotation]);

    return {
      data: newAnnotation,
      error: null
    };
  }

  async updateAnnotation(
    annotationId: string,
    updates: Partial<Annotation>
  ): Promise<ApiResponse<Annotation>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let updatedAnnotation: Annotation | null = null;

    this.annotations.forEach((annotations, recordingId) => {
      const index = annotations.findIndex(a => a.id === annotationId);
      if (index !== -1) {
        const existing = annotations[index];
        updatedAnnotation = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        annotations[index] = updatedAnnotation;
        this.annotations.set(recordingId, annotations);
      }
    });

    if (!updatedAnnotation) {
      return {
        data: null as any,
        error: {
          code: 'NOT_FOUND',
          message: 'Annotation not found'
        }
      };
    }

    return {
      data: updatedAnnotation,
      error: null
    };
  }

  async deleteAnnotation(annotationId: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let found = false;
    this.annotations.forEach((annotations, recordingId) => {
      const index = annotations.findIndex(a => a.id === annotationId);
      if (index !== -1) {
        annotations.splice(index, 1);
        this.annotations.set(recordingId, annotations);
        found = true;
      }
    });

    if (!found) {
      return {
        data: null as any,
        error: {
          code: 'NOT_FOUND',
          message: 'Annotation not found'
        }
      };
    }

    return {
      data: undefined,
      error: null
    };
  }

  async updateClientGoal(
    goalId: string,
    updates: Partial<TherapyGoal>
  ): Promise<ApiResponse<TherapyGoal>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let updatedGoal: TherapyGoal | null = null;

    this.goals.forEach((goals, clientId) => {
      const index = goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        const existing = goals[index];
        updatedGoal = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        goals[index] = updatedGoal;
        this.goals.set(clientId, goals);
      }
    });

    if (!updatedGoal) {
      return {
        data: null as any,
        error: {
          code: 'NOT_FOUND',
          message: 'Goal not found'
        }
      };
    }

    return {
      data: updatedGoal,
      error: null
    };
  }

  async addClientGoal(
    clientId: string,
    goal: Omit<TherapyGoal, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<TherapyGoal>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newGoal: TherapyGoal = {
      ...goal,
      id: `goal_${clientId}_${Date.now()}`,
      clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const clientGoals = this.goals.get(clientId) || [];
    this.goals.set(clientId, [...clientGoals, newGoal]);

    return {
      data: newGoal,
      error: null
    };
  }

  // Additional helper methods for bulk operations
  async getClientSummaries(therapistId: string): Promise<ApiResponse<Array<ClientProfile & { goals: TherapyGoal[] }>>> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const summaries = this.clients
      .filter(client => client.assignedTherapistId === therapistId)
      .map(client => ({
        ...client,
        goals: this.goals.get(client.id) || []
      }));

    return {
      data: summaries,
      error: null
    };
  }

  async searchClients(query: string): Promise<ApiResponse<ClientProfile[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const searchTerm = query.toLowerCase();
    const results = this.clients.filter(client =>
      client.firstName.toLowerCase().includes(searchTerm) ||
      client.lastName.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm)
    );

    return {
      data: results,
      error: null
    };
  }
}

export const enhancedMockApiClient = new EnhancedMockApiClient();
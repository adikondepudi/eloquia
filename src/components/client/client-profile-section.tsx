// /src/components/client/client-profile-section.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Phone, Mail, MapPin, User, Calendar } from 'lucide-react';
import { ClientProfile } from '@/types/enhanced-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientProfileSectionProps {
  client: ClientProfile;
  onUpdate: (updates: Partial<ClientProfile>) => Promise<void>;
}

export function ClientProfileSection({ client, onUpdate }: ClientProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: ClientProfile['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/15 text-green-700 border-green-600/20';
      case 'inactive':
        return 'bg-gray-500/15 text-gray-700 border-gray-600/20';
      case 'pending':
        return 'bg-yellow-500/15 text-yellow-700 border-yellow-600/20';
      default:
        return 'bg-gray-500/15 text-gray-700 border-gray-600/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Basic Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Client Status</span>
                </div>
                <Badge className={getStatusColor(client.status)}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                </div>
                <p>{format(new Date(client.dateOfBirth), 'MMMM d, yyyy')}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {client.address.street}, {client.address.city}, {client.address.state} {client.address.zipCode}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Diagnosis</h4>
              <p className="text-muted-foreground">{client.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Medical History</h4>
              <ul className="list-disc list-inside space-y-1">
                {client.medicalHistory.map((item, index) => (
                  <li key={index} className="text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Insurance Information</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Provider: </span>
                  {client.insuranceInfo.provider}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Policy Number: </span>
                  {client.insuranceInfo.policyNumber}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Group Number: </span>
                  {client.insuranceInfo.groupNumber}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Emergency Contact</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">{client.emergencyContact.name}</h4>
              <p className="text-sm text-muted-foreground">
                {client.emergencyContact.relationship}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.emergencyContact.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
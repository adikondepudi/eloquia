// /app/upload/page.tsx
'use client';

import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadForm } from "@/components/upload/upload-form";
import { RecentUploads } from "@/components/dashboard/recent-uploads";
import { AudioRecording } from "@/types/upload";
import { apiClient } from "@/lib/api-config";

export default function UploadPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [recentUploads, setRecentUploads] = useState<AudioRecording[]>([]);
  
  if (!isLoaded) {
    return null;
  }
  
  if (!isSignedIn) {
    redirect("/sign-in");
  }

  const handleUploadSuccess = async (newRecording: AudioRecording) => {
    // Refresh the recent uploads list
    if (user?.id) {
      const response = await apiClient.getRecordings(user.id);
      setRecentUploads(response.data);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Upload Recording</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload New Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadForm onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <RecentUploads recordings={recentUploads} />
        </div>
      </div>
    </div>
  );
}
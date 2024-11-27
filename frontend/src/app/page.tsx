'use client';

import AudioRecorder from "@/components/AudioRecorder";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Speech Fluency Analysis</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Record Your Speech</h2>
            <AudioRecorder />
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
            <p className="text-gray-600">Your analysis results will appear here</p>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}
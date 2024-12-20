'use client';

import { SignIn } from "@clerk/nextjs";
import { useEffect } from 'react';

export default function SignInPage() {
  useEffect(() => {
    // Force a hard reload if we detect a chunk loading error
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error?.toString().includes('ChunkLoadError')) {
        window.location.reload();
      }
    };

    window.addEventListener('error', handleChunkError);
    return () => window.removeEventListener('error', handleChunkError);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none"
          }
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
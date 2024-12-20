// /app/page.tsx
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function LandingPage() {
  const { userId } = await auth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Speech Analytics</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Upload your speech recordings and get detailed analytics on fluency patterns and improvements over time.
      </p>
      
      {userId ? (
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      ) : (
        <Button asChild size="lg">
          <Link href="/sign-in">Get Started</Link>
        </Button>
      )}
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('userType');

  useEffect(() => {
    // Store the user type in localStorage when signing in
    if (userType) {
      localStorage.setItem('userType', userType);
    }
  }, [userType]);

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
        redirectUrl={userType === 'therapist' ? '/therapist/dashboard' : '/dashboard'}
        afterSignInUrl={userType === 'therapist' ? '/therapist/dashboard' : '/dashboard'}
      />
    </div>
  );
}
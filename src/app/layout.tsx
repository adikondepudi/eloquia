'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { MainNav } from '@/components/navigation/main-nav';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

function AuthHandler({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = ['/', '/sign-in', '/sign-up'].includes(pathname);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isPublicRoute) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router, isPublicRoute]);

  return <>{children}</>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="min-h-screen bg-background font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <AuthHandler>
              <MainNav />
              <main className="flex-1">{children}</main>
            </AuthHandler>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
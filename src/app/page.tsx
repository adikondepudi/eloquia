'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserType } from '@/hooks/use-user-type';
import { Brain, User2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { userType, isLoading } = useUserType();

  useEffect(() => {
    if (isLoaded && isSignedIn && userType && !isLoading) {
      // Redirect based on user type
      if (userType === 'therapist') {
        router.push('/therapist/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, isSignedIn, userType, isLoading, router]);

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerAnimation}
          className="space-y-12 text-center"
        >
          <motion.div variants={itemAnimation} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to Eloquia
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your platform for speech therapy management and progress tracking
            </p>
          </motion.div>

          <motion.div
            variants={itemAnimation}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <Card className="group relative hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Brain className="w-6 h-6" />
                  I'm a Therapist
                </CardTitle>
                <CardDescription>
                  Access your client dashboard, manage sessions, and track progress
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button asChild size="lg" className="group-hover:translate-x-1 transition-transform">
                  <Link href="/sign-in?userType=therapist">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <User2 className="w-6 h-6" />
                  I'm a Client
                </CardTitle>
                <CardDescription>
                  Track your progress, access exercises, and connect with your therapist
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button asChild size="lg" className="group-hover:translate-x-1 transition-transform">
                  <Link href="/sign-in?userType=client">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemAnimation} className="pt-8">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
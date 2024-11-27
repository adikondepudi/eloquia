// // app/page.tsx
// import { auth } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
// import dynamic from 'next/dynamic';

// export default async function DashboardPage() {
//   // Get auth info from clerk middleware
//   const { userId } = auth();
  
//   // Redirect to sign-in if not authenticated
//   if (!userId) {
//     redirect('/sign-in');
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         <MetricsCard />
//         <div className="md:col-span-2">
//           <AnalyticsChart />
//         </div>
//         <div className="lg:col-span-3">
//           <RecentUploads />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Make sure these component imports are properly set up in your project
// const MetricsCard = dynamic(() => import('@/components/dashboard/metrics-card'));
// const AnalyticsChart = dynamic(() => import('@/components/dashboard/analytics-chart'));
// const RecentUploads = dynamic(() => import('@/components/dashboard/recent-uploads'));

// /app/page.tsx
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function LandingPage() {
  const { userId } = auth();
  
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
"use client";

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PerformanceDashboard } from './components/performance-dashboard';
import { useAuth } from '@/app/auth-provider';
import { WeeklyReport } from './components/weekly-report';
import { SalesInsights } from './components/sales-insights';

function PerformanceDashboardSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Skeleton className="h-[350px] w-full" />
                <Skeleton className="h-[350px] w-full" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
  const { user } = useAuth();
  // Get the first name, or use a generic greeting.
  const firstName = user?.displayName?.split(' ')[0] || 'Buddy';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-3xl font-bold tracking-tight">Hi, {firstName}!</h3>
        <p className="text-foreground">Welcome back! Here's your sales performance at a glance.</p>
      </div>
      
      <div className="pt-6 space-y-4">
         <Suspense fallback={<PerformanceDashboardSkeleton />}>
           <PerformanceDashboard />
         </Suspense>
      </div>

      <div className="pt-6 space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">AI Reports</h3>
        <p className="text-muted-foreground">Automated summaries and analyses of your sales data.</p>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <WeeklyReport />
            <SalesInsights />
        </div>
      </div>
    </div>
  );
}

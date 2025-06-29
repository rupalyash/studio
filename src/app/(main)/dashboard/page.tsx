import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PerformanceDashboard } from './components/performance-dashboard';
import { WeeklyReport } from './components/weekly-report';

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
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Sales Performance</h2>
         <Suspense fallback={<PerformanceDashboardSkeleton />}>
           <PerformanceDashboard />
         </Suspense>
      </div>
      
      <div className="pt-6 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">AI Reports</h2>
        <WeeklyReport />
      </div>
    </div>
  );
}

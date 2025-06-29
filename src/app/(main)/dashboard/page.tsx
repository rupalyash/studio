import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PerformanceDashboard } from './components/performance-dashboard';
import { WeeklyReport } from './components/weekly-report';
import { ChatInterface } from './components/chat-interface';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Sales Performance</h2>
         <Suspense fallback={<PerformanceDashboardSkeleton />}>
           <PerformanceDashboard />
         </Suspense>
        
        <div className="pt-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">AI Reports</h2>
          <WeeklyReport />
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Log Activity</h2>
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

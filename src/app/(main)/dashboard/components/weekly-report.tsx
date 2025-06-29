"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { generateWeeklyReport } from "@/ai/flows/generate-weekly-report";

const MOCK_SALES_DATA = `
- Alex (NA): Closed a $50k deal with Innovate Inc. Good progress on the $250k MegaCorp opportunity, proposal sent. Client sentiment is positive.
- Sarah (EU): Onboarded 3 new clients in the retail sector. Facing challenges with a prospect in Germany due to pricing concerns. Had a great meeting with a UK-based company, they are very interested.
- Chen (APAC): Strong pipeline growth in Singapore. Lost a deal in Japan to a competitor. Feedback suggests our product lacks a key feature they needed.
- Maria (LATAM): Exceeded quota by 15%. Client feedback is excellent, especially regarding our support team. A large deal is expected to close next week.
`;

export function WeeklyReport() {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateWeeklyReport({ salesData: MOCK_SALES_DATA });
      setReport(result.report);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setReport("There was an error generating the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Weekly Summary</CardTitle>
        <CardDescription>
          Generate a weekly summary report for leadership based on the latest
          sales activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                AI is analyzing sales data...
              </p>
            </div>
          </div>
        )}
        {report && (
          <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap bg-transparent p-0 font-body text-foreground">
              {report}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateReport} disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate Weekly Report"}
        </Button>
      </CardFooter>
    </Card>
  );
}

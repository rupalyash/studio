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
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function WeeklyReport() {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);

      const q = query(
        collection(db, "sales_updates"),
        where("createdAt", ">=", sevenDaysAgoTimestamp),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("No sales updates found in the last 7 days to generate a report.");
        setIsLoading(false);
        return;
      }

      const salesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return `Update from ${data.createdAt.toDate().toLocaleDateString()}:\n${data.rawText}`;
      }).join("\n\n---\n\n");

      const result = await generateWeeklyReport({ salesData });
      setReport(result.report);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setError("There was an error generating the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Weekly Summary</CardTitle>
        <CardDescription>
          Generate a weekly summary report for leadership based on sales activities logged in the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                AI is analyzing sales data from the database...
              </p>
            </div>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {report && (
          <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap bg-transparent p-0 font-sans text-foreground">
              {report}
            </pre>
          </div>
        )}
         {!isLoading && !report && !error && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <p className="text-center text-muted-foreground">
              Click the button to generate your weekly report.
            </p>
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

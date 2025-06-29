"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { generateWeeklyReport, GenerateWeeklyReportOutput } from "@/ai/flows/generate-weekly-report";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function WeeklyReport() {
  const [report, setReport] = useState<GenerateWeeklyReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
      setError(null);
      setReport(null);
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
        setReport(result);
      } catch (error) {
        console.error("Failed to generate report:", error);
        setError("Failed to generate the report. You may have exceeded your API quota. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    generateReport();
  }, []);

  const handleDownloadPdf = () => {
    if (!report) return;

    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const titleLines = doc.splitTextToSize(report.title, textWidth);
    doc.text(titleLines, pageWidth / 2, yPos, { align: "center" });
    yPos += (titleLines.length * 7) + 8;

    const addSection = (title: string, items: string[]) => {
        if (items.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(title, margin, yPos);
            yPos += 7;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            items.forEach(item => {
                const lines = doc.splitTextToSize(`• ${item}`, textWidth - 5); // Indent bullet
                if (yPos + (lines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    yPos = margin;
                }
                doc.text(lines, margin + 5, yPos);
                yPos += lines.length * 5 + 2; // Add line spacing
            });
            yPos += 5; // Space after section
        }
    };

    addSection("Key Achievements", report.keyAchievements);
    addSection("Challenges", report.challenges);
    addSection("Actionable Insights", report.actionableInsights);

    doc.save("weekly-sales-report.pdf");
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/20 shadow-xl">
      <CardHeader>
        <CardTitle>Automated Weekly Summary</CardTitle>
        <CardDescription>
          A weekly summary report for leadership based on sales activities logged in the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {isLoading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                AI is analyzing sales data from the last 7 days...
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
            <div className="space-y-4 rounded-md border bg-muted/50 p-6">
                <h3 className="text-lg font-bold text-foreground">{report.title}</h3>
                
                {report.keyAchievements.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Key Achievements</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                            {report.keyAchievements.map((item, i) => <li key={`ach-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
        
                {report.challenges.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Challenges</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                            {report.challenges.map((item, i) => <li key={`chal-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
        
                {report.actionableInsights.length > 0 && (
                     <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Actionable Insights</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                            {report.actionableInsights.map((item, i) => <li key={`ins-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        )}
         {!isLoading && !report && !error && (
            <div className="flex items-center justify-center rounded-md border border-dashed p-10">
              <p className="text-center text-muted-foreground">
                No sales data found from the last 7 days to generate a report.
              </p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        {report && !isLoading && (
            <Button onClick={handleDownloadPdf} className="bg-foreground text-background hover:bg-foreground/90">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

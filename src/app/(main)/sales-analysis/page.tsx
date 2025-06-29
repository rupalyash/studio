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
import { Loader2, Download, NotebookPen, MessageSquareQuote, Lightbulb } from "lucide-react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeSalesInsights, AnalyzeSalesInsightsOutput } from "@/ai/flows/analyze-sales-insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

function InsightCategoryContent({ category }: { category: { summary: string; details: string[] } }) {
    if (!category.summary && category.details.length === 0) {
        return <p className="text-sm text-muted-foreground p-4 text-center">No data found for this category.</p>
    }

    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-sm">Summary</h4>
                <p className="text-sm text-muted-foreground mt-1">{category.summary}</p>
            </div>
            {category.details.length > 0 && (
                 <div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-sm font-semibold">View Detailed Points ({category.details.length})</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                    {category.details.map((detail, i) => <li key={i}>{detail}</li>)}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    )
}

function SalesAnalysisCard() {
  const [insights, setInsights] = useState<AnalyzeSalesInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeData = async () => {
        setIsLoading(true);
        setInsights(null);
        setError(null);
        try {
          const q = query(
            collection(db, "sales_updates"),
            orderBy("createdAt", "desc"),
            limit(100)
          );

          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            setError("No sales updates found in the database to analyze.");
            setIsLoading(false);
            return;
          }

          const salesUpdates = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              rawText: data.rawText || "",
              summary: data.summary || "",
              keyAchievements: data.keyAchievements || [],
              challenges: data.challenges || [],
            };
          });

          const result = await analyzeSalesInsights({ salesUpdates });
          setInsights(result);
        } catch (err) {
          console.error("Failed to analyze sales insights:", err);
          setError("An error occurred while analyzing the data. Please try again.");
        } finally {
          setIsLoading(false);
        }
    };
    
    analyzeData();
  }, []);

  const handleDownloadPdf = () => {
    if (!insights) return;

    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Deeper Sales Analysis", pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Overall Summary", margin, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(insights.overallSummary, textWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * 5) + 8;

    const addCategorySection = (title: string, category: { summary: string; details: string[] }) => {
      if (!category.summary && category.details.length === 0) return;

      if (yPos > doc.internal.pageSize.getHeight() - margin * 3) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title, margin, yPos);
      yPos += 7;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Summary:", margin, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      const catSummaryLines = doc.splitTextToSize(category.summary, textWidth);
      doc.text(catSummaryLines, margin, yPos);
      yPos += (catSummaryLines.length * 5) + 5;

      if (category.details.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Points:", margin, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");

        category.details.forEach(detail => {
          const lines = doc.splitTextToSize(`• ${detail}`, textWidth - 5);
          if (yPos + (lines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(lines, margin + 5, yPos);
          yPos += lines.length * 5 + 2;
        });
      }
      yPos += 8;
    };

    addCategorySection("Meeting Notes", insights.meetingNotes);
    addCategorySection("Client Feedback", insights.clientFeedback);
    addCategorySection("New Opportunities", insights.newOpportunities);

    doc.save("sales-analysis-report.pdf");
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
      <CardHeader>
        <CardTitle>AI-Powered Analysis</CardTitle>
        <CardDescription>
          AI analysis of up to 100 recent sales updates from the database, categorized into actionable insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {isLoading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                AI is analyzing up to 100 recent sales updates...
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
        {insights && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Overall Summary</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{insights.overallSummary}</p>
                </div>
                <Separator />
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Detailed Breakdown</h3>
                    <Tabs defaultValue="meeting-notes" className="mt-2 w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-muted/50 border">
                            <TabsTrigger value="meeting-notes">
                                <NotebookPen className="mr-2 h-4 w-4" />
                                Meeting Notes
                            </TabsTrigger>
                            <TabsTrigger value="client-feedback">
                                <MessageSquareQuote className="mr-2 h-4 w-4" />
                                Client Feedback
                            </TabsTrigger>
                            <TabsTrigger value="new-opportunities">
                                <Lightbulb className="mr-2 h-4 w-4" />
                                New Opportunities
                            </TabsTrigger>
                        </TabsList>
                        
                        <div className="mt-4">
                            <TabsContent value="meeting-notes">
                                <InsightCategoryContent category={insights.meetingNotes} />
                            </TabsContent>
                            <TabsContent value="client-feedback">
                                <InsightCategoryContent category={insights.clientFeedback} />
                            </TabsContent>
                            <TabsContent value="new-opportunities">
                                <InsightCategoryContent category={insights.newOpportunities} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        )}
         {!isLoading && !insights && !error && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <p className="text-center text-muted-foreground">
              No sales data found to generate a report.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {insights && (
            <Button 
              onClick={handleDownloadPdf} 
              disabled={isLoading || !insights} 
              className="bg-foreground text-background hover:bg-foreground/90"
            >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function SalesAnalysisPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Deeper Sales Analysis</h1>
            <p className="text-muted-foreground">
                Use AI to analyze all historical sales data from the database, categorizing it into actionable insights.
            </p>
        </div>
        <SalesAnalysisCard />
    </div>
  );
}

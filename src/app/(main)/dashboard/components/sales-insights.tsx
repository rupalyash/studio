"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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

export function SalesInsights() {
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
          // Manually construct the object to ensure it's a plain, serializable object
          // that matches the AI flow's input schema. This avoids passing non-serializable
          // objects like Firestore Timestamps to the server action.
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
  }, [])

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/20 shadow-xl">
      <CardHeader>
        <CardTitle>Deeper Sales Analysis</CardTitle>
        <CardDescription>
          AI analysis of historical sales data from the database, categorized into actionable insights.
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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="meeting-notes">Meeting Notes</TabsTrigger>
                            <TabsTrigger value="client-feedback">Client Feedback</TabsTrigger>
                            <TabsTrigger value="new-opportunities">New Opportunities</TabsTrigger>
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
    </Card>
  );
}

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

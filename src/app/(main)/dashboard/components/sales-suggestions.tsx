"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, TrendingUp, MessageSquareQuote, MapPinned } from "lucide-react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateSalesSuggestions, GenerateSalesSuggestionsOutput } from "@/ai/flows/generate-sales-suggestions";

export function SalesSuggestions() {
  const [suggestions, setSuggestions] = useState<GenerateSalesSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch sales updates
        const salesUpdatesQuery = query(
          collection(db, "sales_updates"),
          orderBy("createdAt", "desc"),
          limit(100)
        );
        const salesUpdatesSnapshot = await getDocs(salesUpdatesQuery);
        const salesUpdates = salesUpdatesSnapshot.docs.map(doc => ({
          rawText: doc.data().rawText || "",
        }));

        // Fetch performance metrics - removed orderBy to avoid needing a composite index
        const performanceMetricsQuery = query(collection(db, "performance_metrics"));
        const performanceMetricsSnapshot = await getDocs(performanceMetricsQuery);
        const performanceMetrics = performanceMetricsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                year: parseInt(doc.id, 10),
                totalRevenue: data.totalRevenue,
                newLeads: data.newLeads,
                conversionRate: data.conversionRate,
                salesByRegion: data.salesByRegion,
            };
        }).sort((a, b) => b.year - a.year); // Sort on the client side

        if (salesUpdates.length === 0 && performanceMetrics.length === 0) {
          setError("No data found in the database to generate suggestions.");
          return;
        }

        const result = await generateSalesSuggestions({ salesUpdates, performanceMetrics });
        setSuggestions(result);
      } catch (err) {
        console.error("Failed to generate sales suggestions:", err);
        setError("An error occurred while generating suggestions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    analyzeData();
  }, []);

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
      <CardHeader>
        <CardTitle>Strategic AI Suggestions</CardTitle>
        <CardDescription>
          AI-powered recommendations based on your historical sales and performance data.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {isLoading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                AI is analyzing your data for strategic insights...
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
        {suggestions && (
          <div className="space-y-6">
            {suggestions.salesIncreaseSuggestions.length > 0 && (
                <SuggestionSection
                    title="How to Increase Sales"
                    icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                    items={suggestions.salesIncreaseSuggestions}
                />
            )}
            {suggestions.clientFeedbackSuggestions.length > 0 && (
                <SuggestionSection
                    title="Based on Client Feedback"
                    icon={<MessageSquareQuote className="h-5 w-5 text-blue-500" />}
                    items={suggestions.clientFeedbackSuggestions}
                />
            )}
            {suggestions.regionsToWatch.length > 0 && (
                <SuggestionSection
                    title="Regions to Watch"
                    icon={<MapPinned className="h-5 w-5 text-orange-500" />}
                    items={suggestions.regionsToWatch}
                />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SuggestionSectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
}

function SuggestionSection({ title, icon, items }: SuggestionSectionProps) {
    return (
        <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-md font-semibold text-foreground">
                {icon}
                {title}
            </h4>
            <ul className="list-disc list-outside space-y-2 pl-8 text-sm text-muted-foreground">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );
}

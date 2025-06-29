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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Loader2 } from "lucide-react";
import { summarizeMarketInsights } from "@/ai/flows/summarize-market-insights";
import { TrendCard } from "./trend-card";

interface SummaryResult {
  summary: string;
  trends: string[];
}

export function InsightsEngine() {
  const [industry, setIndustry] = useState("BFSI");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!industry.trim()) {
      setError("Please enter an industry to analyze.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const summary = await summarizeMarketInsights({ industry });
      setResult(summary);
    } catch (e) {
      console.error(e);
      setError("Failed to analyze insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
          <CardHeader>
            <CardTitle>Market Insights Engine</CardTitle>
            <CardDescription>
              Get the latest news and trends for any industry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can enter multiple industries separated by commas.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Analyzing..." : "Fetch Insights"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="min-h-[400px] bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-generated summary based on the latest news.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center rounded-md border border-dashed p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    AI is fetching and analyzing the latest news...
                  </p>
                </div>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Emerging Trends & Opportunities
                  </h3>
                  <div className="space-y-3">
                    {result.trends.map((trend, index) => (
                      <TrendCard key={index} trend={trend} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!isLoading && !result && !error && (
              <div className="flex items-center justify-center rounded-md border border-dashed p-10">
                <p className="text-muted-foreground">
                  Your insights will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

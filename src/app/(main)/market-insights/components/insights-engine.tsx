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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2 } from "lucide-react";
import { summarizeMarketInsights, MarketInsightSource } from "@/ai/flows/summarize-market-insights";
import { TrendCard } from "./trend-card";

interface SummaryResult {
  summary: string;
  trends: string[];
}

export function InsightsEngine() {
  const [industry, setIndustry] = useState("BFSI");
  const [articleContent, setArticleContent] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!articleContent) {
        setError("Please paste some article content to analyze.");
        return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    const sources: MarketInsightSource[] = [
      {
        title: "Pasted Article",
        url: "https://example.com/pasted-article",
        content: articleContent,
      },
    ];

    try {
      const summary = await summarizeMarketInsights({ sources, industry });
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
        <Card>
          <CardHeader>
            <CardTitle>Market Insights Engine</CardTitle>
            <CardDescription>
              Analyze external news to identify market trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BFSI">BFSI</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="article">News / Article Content</Label>
              <Textarea
                id="article"
                placeholder="Paste the full content of a news article here..."
                className="h-48"
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Analyzing..." : "Analyze Market"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="min-h-[400px]">
            <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && (
                     <div className="flex items-center justify-center rounded-md border border-dashed p-10">
                        <div className="flex flex-col items-center gap-2 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                            AI is scanning for trends and opportunities...
                        </p>
                        </div>
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {result && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Summary</h3>
                            <p className="text-sm text-muted-foreground">{result.summary}</p>
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold mb-4">Emerging Trends & Opportunities</h3>
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
                        <p className="text-muted-foreground">Your insights will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

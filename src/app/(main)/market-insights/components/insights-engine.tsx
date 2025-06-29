"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { summarizeMarketInsights } from "@/ai/flows/summarize-market-insights";
import { TrendCard } from "./trend-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SummaryResult {
  summary: string;
  trends: string[];
}

const initialIndustries = [
  "Retail fashion",
  "Medical",
  "Automobile",
  "Ecommerce fashion",
];

export function InsightsEngine() {
  const [industries, setIndustries] = useState<string[]>(initialIndustries);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustries[0]);
  const [newIndustry, setNewIndustry] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedIndustry.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const summary = await summarizeMarketInsights({ industry: selectedIndustry });
      setResult(summary);
    } catch (e) {
      console.error(e);
      setError("Failed to analyze insights. You may have exceeded your API quota. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIndustry = () => {
    const trimmedIndustry = newIndustry.trim();
    if (trimmedIndustry && !industries.find(i => i.toLowerCase() === trimmedIndustry.toLowerCase())) {
        const updatedIndustries = [...industries, trimmedIndustry];
        setIndustries(updatedIndustries);
        setSelectedIndustry(trimmedIndustry);
        setNewIndustry("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddIndustry();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
          <CardHeader>
            <CardTitle>Market Insights Engine</CardTitle>
            <CardDescription>
              Select an industry and click &quot;Analyze&quot; to see the latest trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry-select">Industry</Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger id="industry-select" className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-industry">Add New Industry</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="new-industry"
                  placeholder="e.g., Biotechnology"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button variant="outline" size="icon" onClick={handleAddIndustry} disabled={!newIndustry.trim()}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Industry</span>
                </Button>
              </div>
            </div>
             <Button onClick={handleAnalyze} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? "Analyzing..." : "Analyze Industry"}
              </Button>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="min-h-[400px] bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
          <CardHeader>
            <CardTitle>Analysis for: <span className="text-primary">{selectedIndustry}</span></CardTitle>
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
            {error && (
              <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
                <p className="text-center text-muted-foreground">
                  Select an industry and click &quot;Analyze Industry&quot; to see insights.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

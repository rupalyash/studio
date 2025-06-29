"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Plus } from "lucide-react";
import { summarizeMarketInsights } from "@/ai/flows/summarize-market-insights";
import { TrendCard } from "./trend-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyze = async () => {
      if (!selectedIndustry.trim()) return;
      
      setIsLoading(true);
      setResult(null);
      setError(null);

      try {
        const summary = await summarizeMarketInsights({ industry: selectedIndustry });
        setResult(summary);
      } catch (e) {
        console.error(e);
        setError("Failed to analyze insights. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    analyze();
  }, [selectedIndustry]);

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
              Select an industry or add a new one to see the latest trends.
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

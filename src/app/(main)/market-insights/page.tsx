import { InsightsEngine } from './components/insights-engine';

export default function MarketInsightsPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Market & Industry Insights</h1>
            <p className="text-muted-foreground">
                Use AI to fetch and summarize the latest news for any industry.
            </p>
        </div>
        <InsightsEngine />
    </div>
  );
}

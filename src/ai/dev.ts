import { config } from 'dotenv';
config();

import '@/ai/flows/generate-weekly-report.ts';
import '@/ai/flows/summarize-market-insights.ts';
import '@/ai/flows/summarize-sales-data.ts';
import '@/ai/flows/analyze-sales-insights.ts';
import '@/ai/tools/news-recommender.ts';

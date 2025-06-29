'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing market insights by fetching live news.
 *
 * - summarizeMarketInsights - A function that fetches and summarizes news for a given industry.
 * - SummarizeMarketInsightsInput - The input type for the summarizeMarketInsights function.
 * - SummarizeMarketInsightsOutput - The return type for the summarizeMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getLatestNews } from '@/ai/tools/news-recommender';

const SummarizeMarketInsightsInputSchema = z.object({
  industry: z.string().describe('The industry to focus the market insights on. Can be a comma-separated list of industries.'),
});

export type SummarizeMarketInsightsInput = z.infer<
  typeof SummarizeMarketInsightsInputSchema
>;

const SummarizeMarketInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the market insights based on the latest news.'),
  trends: z.array(
    z.string().describe('A list of emerging market trends and opportunities.')
  ),
});

export type SummarizeMarketInsightsOutput = z.infer<
  typeof SummarizeMarketInsightsOutputSchema
>;

export async function summarizeMarketInsights(
  input: SummarizeMarketInsightsInput
): Promise<SummarizeMarketInsightsOutput> {
  return summarizeMarketInsightsFlow(input);
}

const summarizeMarketInsightsPrompt = ai.definePrompt({
  name: 'summarizeMarketInsightsPrompt',
  input: {
    schema: SummarizeMarketInsightsInputSchema,
  },
  output: {
    schema: SummarizeMarketInsightsOutputSchema,
  },
  tools: [getLatestNews],
  prompt: `You are an AI-powered market analyst, providing insights for sales strategists.

  Your goal is to analyze and summarize the latest news to identify emerging market trends and opportunities for the specified industry or industries.

  Industry/Industries: {{{industry}}}

  First, use the 'getLatestNews' tool to fetch recent articles related to this industry. If multiple industries are provided, you can call the tool for each one.

  After gathering the news, generate a concise summary of the overall market insights and highlight any emerging trends and opportunities. The trends array should be as specific and actionable as possible.

  Make sure the output is in the requested JSON format.
  `,
});

const summarizeMarketInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeMarketInsightsFlow',
    inputSchema: SummarizeMarketInsightsInputSchema,
    outputSchema: SummarizeMarketInsightsOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketInsightsPrompt(input);
    return output!;
  }
);

// Summarizes market insights from external news and articles.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketInsightSourceSchema = z.object({
  title: z.string().describe('The title of the article or news source.'),
  url: z.string().url().describe('The URL of the article or news source.'),
  content: z.string().describe('The content of the article or news source.'),
});

export type MarketInsightSource = z.infer<typeof MarketInsightSourceSchema>;

const SummarizeMarketInsightsInputSchema = z.object({
  sources: z.array(MarketInsightSourceSchema).describe('An array of market insight sources to summarize.'),
  industry: z.string().describe('The industry to focus the market insights on.'),
});

export type SummarizeMarketInsightsInput = z.infer<
  typeof SummarizeMarketInsightsInputSchema
>;

const SummarizeMarketInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the market insights.'),
  trends: z.array(
    z.string().describe('Emerging market trends and opportunities.')
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
  prompt: `You are an AI-powered market analyst, providing insights for sales strategists.

  Your goal is to analyze and summarize external news and articles to identify emerging market trends and opportunities related to the sales strategy for the given industry.

  Industry: {{{industry}}}

  Sources:
  {{#each sources}}
  Title: {{{this.title}}}
  URL: {{{this.url}}}
  Content: {{{this.content}}}
  {{/each}}

  Based on the provided sources, generate a concise summary of the market insights and highlight any emerging trends and opportunities. The trends array should be as specific and concise as possible.
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

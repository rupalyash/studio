'use server';

/**
 * @fileOverview Analyzes a collection of sales updates to extract and categorize insights.
 *
 * - analyzeSalesInsights - A function that analyzes sales data.
 * - AnalyzeSalesInsightsInput - The input type for the analyzeSalesInsights function.
 * - AnalyzeSalesInsightsOutput - The return type for the analyzeSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesUpdateSchema = z.object({
    rawText: z.string(),
    summary: z.string(),
    keyAchievements: z.array(z.string()),
    challenges: z.array(z.string()),
});

const AnalyzeSalesInsightsInputSchema = z.object({
  salesUpdates: z.array(SalesUpdateSchema).describe('A collection of sales updates from the database.'),
});
export type AnalyzeSalesInsightsInput = z.infer<typeof AnalyzeSalesInsightsInputSchema>;


const InsightCategorySchema = z.object({
    summary: z.string().describe('A concise summary of this category.'),
    details: z.array(z.string()).describe('A list of specific, detailed points for this category.'),
});

const AnalyzeSalesInsightsOutputSchema = z.object({
  overallSummary: z.string().describe('A high-level summary of all combined sales updates.'),
  meetingNotes: InsightCategorySchema.describe('Insights categorized as meeting notes.'),
  clientFeedback: InsightCategorySchema.describe('Insights categorized as client feedback.'),
  newOpportunities: InsightCategorySchema.describe('Insights categorized as new opportunities.'),
});
export type AnalyzeSalesInsightsOutput = z.infer<typeof AnalyzeSalesInsightsOutputSchema>;

export async function analyzeSalesInsights(input: AnalyzeSalesInsightsInput): Promise<AnalyzeSalesInsightsOutput> {
  return analyzeSalesInsightsFlow(input);
}

const analyzeSalesInsightsPrompt = ai.definePrompt({
  name: 'analyzeSalesInsightsPrompt',
  input: {schema: AnalyzeSalesInsightsInputSchema},
  output: {schema: AnalyzeSalesInsightsOutputSchema},
  prompt: `You are a senior sales analyst AI. Your task is to analyze a series of sales update logs and categorize them into meaningful insights.

The user has provided a collection of sales updates. For each update, they have provided the raw text and a preliminary AI summary. Use the raw text as the primary source of truth.

Analyze all the provided sales updates combined and perform the following actions:
1.  **Generate an Overall Summary**: Write a high-level summary that encapsulates the key activities, trends, and sentiments across all updates.
2.  **Categorize and Detail**: Go through each update and extract specific points, categorizing them into three groups: "Meeting Notes", "Client Feedback", and "New Opportunities".
    - For each category, provide a concise summary of the findings within that category.
    - Also for each category, provide a list of detailed, specific points extracted from the logs. If no information for a category exists, return an empty summary and an empty list of details for it.

Here are the sales updates:
{{#each salesUpdates}}
---
Raw Text: {{{this.rawText}}}
---
{{/each}}

Produce your output in the requested JSON format.
`,
});

const analyzeSalesInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeSalesInsightsFlow',
    inputSchema: AnalyzeSalesInsightsInputSchema,
    outputSchema: AnalyzeSalesInsightsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSalesInsightsPrompt(input);
    return output!;
  }
);

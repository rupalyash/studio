'use server';

/**
 * @fileOverview Generates strategic sales suggestions based on historical data.
 *
 * - generateSalesSuggestions - A function that analyzes sales and performance data.
 * - GenerateSalesSuggestionsInput - The input type for the function.
 * - GenerateSalesSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceMetricSchema = z.object({
    year: z.number().optional(),
    totalRevenue: z.number().optional(),
    newLeads: z.number().optional(),
    conversionRate: z.number().optional(),
    salesByRegion: z.array(z.object({
        region: z.string(),
        sales: z.number(),
    })).optional(),
});

const SalesUpdateSchema = z.object({
    rawText: z.string(),
});

const GenerateSalesSuggestionsInputSchema = z.object({
  performanceMetrics: z.array(PerformanceMetricSchema).describe('A collection of yearly performance metrics.'),
  salesUpdates: z.array(SalesUpdateSchema).describe('A collection of raw sales updates which include meeting notes and client feedback.'),
});
export type GenerateSalesSuggestionsInput = z.infer<typeof GenerateSalesSuggestionsInputSchema>;

const GenerateSalesSuggestionsOutputSchema = z.object({
  salesIncreaseSuggestions: z.array(z.string()).describe('A list of actionable suggestions for increasing overall sales.'),
  clientFeedbackSuggestions: z.array(z.string()).describe('A list of suggestions derived directly from analyzing client feedback within the sales updates.'),
  regionsToWatch: z.array(z.string()).describe('A list of regions to pay attention to, with a brief explanation for each (e.g., "APAC: High growth potential based on recent deals", "EU: Watch for declining lead conversion").'),
});
export type GenerateSalesSuggestionsOutput = z.infer<typeof GenerateSalesSuggestionsOutputSchema>;

export async function generateSalesSuggestions(input: GenerateSalesSuggestionsInput): Promise<GenerateSalesSuggestionsOutput> {
  return generateSalesSuggestionsFlow(input);
}

const generateSalesSuggestionsPrompt = ai.definePrompt({
  name: 'generateSalesSuggestionsPrompt',
  input: {schema: GenerateSalesSuggestionsInputSchema},
  output: {schema: GenerateSalesSuggestionsOutputSchema},
  prompt: `You are a master sales strategist AI. Your task is to analyze comprehensive sales data and provide actionable suggestions to leadership.

You have been provided with two sets of data:
1.  **Performance Metrics**: Structured data containing yearly figures for revenue, leads, conversion rates, and sales by region.
2.  **Sales Updates**: A collection of unstructured text logs from the sales team, which include meeting notes, client feedback, and deal updates.

Analyze all of this data holistically and provide the following insights in the requested JSON format:

1.  **Sales Increase Suggestions**: Based on performance trends, successful deals mentioned in the updates, and market opportunities, provide a list of concrete, actionable strategies to boost overall sales.
2.  **Client Feedback Suggestions**: Carefully read through the 'Sales Updates' for any direct or indirect client feedback. Synthesize this feedback into a list of suggestions for product, service, or process improvements.
3.  **Regions to Watch**: Identify key geographical regions from the 'Performance Metrics' and 'Sales Updates'. For each region, provide a concise note on why it's important to watch. This could be due to strong growth, recent decline, significant client feedback, or untapped potential. Example: "NA: Strongest performing region, consider doubling down on marketing efforts here."

**Performance Metrics Data:**
{{#each performanceMetrics}}
Year: {{this.year}}
- Total Revenue: {{this.totalRevenue}}
- New Leads: {{this.newLeads}}
- Conversion Rate: {{this.conversionRate}}%
- Sales by Region:
  {{#each this.salesByRegion}}
  - {{this.region}}: {{this.sales}}
  {{/each}}
{{/each}}

**Raw Sales Updates (contains client feedback):**
{{#each salesUpdates}}
---
{{{this.rawText}}}
---
{{/each}}
`,
});

const generateSalesSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSalesSuggestionsFlow',
    inputSchema: GenerateSalesSuggestionsInputSchema,
    outputSchema: GenerateSalesSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await generateSalesSuggestionsPrompt(input);
    return output!;
  }
);

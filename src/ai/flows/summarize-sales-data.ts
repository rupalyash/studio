'use server';

/**
 * @fileOverview Summarizes sales data from chat logs to provide key insights for sales managers.
 *
 * - summarizeSalesData - A function that summarizes sales data.
 * - SummarizeSalesDataInput - The input type for the summarizeSalesData function.
 * - SummarizeSalesDataOutput - The return type for the summarizeSalesData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSalesDataInputSchema = z.object({
  chatLogs: z.string().describe('The chat logs from the sales team.'),
});
export type SummarizeSalesDataInput = z.infer<typeof SummarizeSalesDataInputSchema>;

const RegionSaleUpdateSchema = z.object({
    region: z.string().describe("The geographical region (e.g., NA, EU, APAC)."),
    sales: z.number().describe("The total sales amount for that region."),
    updateType: z.enum(["set", "increment"]).describe("If the user is stating a new total value for a region (e.g., 'NA sales are now $5M'), use 'set'. If they are logging a new individual sale to be added to the total, use 'increment'.")
});

const OpportunityStageUpdateSchema = z.object({
    stage: z.string().describe("The stage of the sales opportunity (e.g., Prospect, Qualify, Closed)."),
    value: z.number().describe("The number of opportunities in that stage."),
    updateType: z.enum(["set", "increment"]).describe("If the user is providing a new total count for a stage (e.g., 'We now have 15 qualified leads'), use 'set'. If they are logging new opportunities to be added, use 'increment'.")
});

const PerformanceMetricsSchema = z.object({
    year: z.number().optional().describe("The year the metrics apply to. If a year is mentioned, use that. Otherwise, this can be omitted."),
    totalRevenue: z.number().optional().describe("The total revenue figure mentioned in the update."),
    newLeads: z.number().optional().describe("The number of new leads mentioned in the update."),
    conversionRate: z.number().optional().describe("The conversion rate percentage mentioned in the update."),
    salesByRegion: z.array(RegionSaleUpdateSchema).optional().describe("A breakdown of sales by geographical region."),
    opportunitiesByStage: z.array(OpportunityStageUpdateSchema).optional().describe("A breakdown of opportunities by sales stage."),
}).optional();


const SummarizeSalesDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the key insights from the sales team chat logs.'),
  keyAchievements: z.array(z.string()).describe('Key achievements highlighted in the logs.'),
  challenges: z.array(z.string()).describe('Challenges identified in the logs.'),
  actionableInsights: z.array(z.string()).describe('Actionable insights derived from the logs.'),
  performanceMetrics: PerformanceMetricsSchema.describe("If the log contains specific performance metrics (like revenue, leads, regional sales), extract them here. If a year is mentioned for these metrics (e.g., '2023 performance'), extract it into the 'year' field. Otherwise, leave this field null or undefined."),
});
export type SummarizeSalesDataOutput = z.infer<typeof SummarizeSalesDataOutputSchema>;

export async function summarizeSalesData(input: SummarizeSalesDataInput): Promise<SummarizeSalesDataOutput> {
  return summarizeSalesDataFlow(input);
}

const summarizeSalesDataPrompt = ai.definePrompt({
  name: 'summarizeSalesDataPrompt',
  input: {schema: SummarizeSalesDataInputSchema},
  output: {schema: SummarizeSalesDataOutputSchema},
  prompt: `You are an AI assistant helping sales managers understand their team's performance.

  Analyze the following chat logs from the sales team and provide a summary of the key insights.
  Identify key achievements, challenges, and actionable insights.

  Also, if the chat log contains specific, quantifiable performance metrics (like Total Revenue, New Leads, Conversion Rate, Sales by Region, or Opportunities Pipeline), extract them into the 'performanceMetrics' object. If a year is mentioned for these metrics (e.g., '2023 performance'), extract it into the 'year' field.

  For 'salesByRegion' and 'opportunitiesByStage', you must determine the user's intent:
  - If they are providing a new total value for a region or stage (e.g., "Total sales for NA are $5M", "We now have 10 prospects"), set the 'updateType' to 'set'.
  - If they are logging a new, individual event to be added to a total (e.g., "Just closed a $50k deal in EU", "Added 3 new leads to the pipeline"), set the 'updateType' to 'increment'.

  Chat Logs:
  {{{chatLogs}}}

  Format your response as a JSON object.
  `,
});

const summarizeSalesDataFlow = ai.defineFlow(
  {
    name: 'summarizeSalesDataFlow',
    inputSchema: SummarizeSalesDataInputSchema,
    outputSchema: SummarizeSalesDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeSalesDataPrompt(input);
    return output!;
  }
);

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

const SummarizeSalesDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the key insights from the sales team chat logs.'),
  keyAchievements: z.array(z.string()).describe('Key achievements highlighted in the logs.'),
  challenges: z.array(z.string()).describe('Challenges identified in the logs.'),
  actionableInsights: z.array(z.string()).describe('Actionable insights derived from the logs.'),
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
  Identify key achievements, challenges, and actionable insights. Use markdown formatting for readability.

  Chat Logs:
  {{chatLogs}}

  Format your response as a JSON object with the following keys:
  - summary: A concise summary of the sales performance and key trends.
  - keyAchievements: A list of key achievements mentioned in the logs.
  - challenges: A list of challenges or obstacles the team is facing.
  - actionableInsights: A list of actionable insights or recommendations based on the logs.
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

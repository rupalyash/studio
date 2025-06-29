'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating weekly sales summary reports.
 *
 * - generateWeeklyReport -  A function that generates a weekly sales summary report.
 * - GenerateWeeklyReportInput - The input type for the generateWeeklyReport function.
 * - GenerateWeeklyReportOutput - The return type for the generateWeeklyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyReportInputSchema = z.object({
  salesData: z.string().describe('Sales data for the week.'),
});
export type GenerateWeeklyReportInput = z.infer<typeof GenerateWeeklyReportInputSchema>;

const GenerateWeeklyReportOutputSchema = z.object({
  title: z.string().describe('A title for the weekly report, including the date range.'),
  keyAchievements: z.array(z.string()).describe('A list of key achievements for the week.'),
  challenges: z.array(z.string()).describe('A list of challenges faced during the week.'),
  actionableInsights: z.array(z.string()).describe('A list of actionable insights derived from the data.'),
});
export type GenerateWeeklyReportOutput = z.infer<typeof GenerateWeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: GenerateWeeklyReportInput): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const generateWeeklyReportPrompt = ai.definePrompt({
  name: 'generateWeeklyReportPrompt',
  input: {schema: GenerateWeeklyReportInputSchema},
  output: {schema: GenerateWeeklyReportOutputSchema},
  prompt: `You are a sales leader. Analyze the following sales data for the week and generate a structured weekly summary report.

Sales Data:
{{{salesData}}}

Based on the data, provide the following in the requested JSON format:
1.  A 'title' for the report that includes a relevant date range.
2.  A list of 'keyAchievements'.
3.  A list of 'challenges'.
4.  A list of 'actionableInsights'.`,
});

const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async input => {
    const {output} = await generateWeeklyReportPrompt(input);
    return output!;
  }
);

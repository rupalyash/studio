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
  report: z.string().describe('A weekly summary report highlighting key achievements, challenges, and actionable insights.'),
});
export type GenerateWeeklyReportOutput = z.infer<typeof GenerateWeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: GenerateWeeklyReportInput): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const generateWeeklyReportPrompt = ai.definePrompt({
  name: 'generateWeeklyReportPrompt',
  input: {schema: GenerateWeeklyReportInputSchema},
  output: {schema: GenerateWeeklyReportOutputSchema},
  prompt: `You are a sales leader. Generate a concise weekly summary report based on the following sales data, highlighting key achievements, challenges, and actionable insights.\n\nSales Data: {{{salesData}}}`,
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

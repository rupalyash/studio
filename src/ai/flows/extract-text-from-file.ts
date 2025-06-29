'use server';
/**
 * @fileOverview Extracts text content from a given file using AI.
 *
 * - extractTextFromFile - A function that handles file content extraction.
 * - ExtractTextFromFileInput - The input type for the function.
 * - ExtractTextFromFileOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromFileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file (image, PDF, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromFileInput = z.infer<typeof ExtractTextFromFileInputSchema>;

const ExtractTextFromFileOutputSchema = z.object({
  extractedText: z.string().describe('The full text content extracted or described from the file.'),
});
export type ExtractTextFromFileOutput = z.infer<typeof ExtractTextFromFileOutputSchema>;

export async function extractTextFromFile(input: ExtractTextFromFileInput): Promise<ExtractTextFromFileOutput> {
  return extractTextFromFileFlow(input);
}

const extractTextFromFilePrompt = ai.definePrompt({
  name: 'extractTextFromFilePrompt',
  input: {schema: ExtractTextFromFileInputSchema},
  output: {schema: ExtractTextFromFileOutputSchema},
  prompt: `You are an expert data extraction AI. Your task is to analyze the provided file and extract all relevant information as plain text.

- If the file is a document (like a PDF, CSV, or spreadsheet), extract all textual content. For tabular data, represent it in a clear, readable text format.
- If the file is an image containing text (like a screenshot or a scanned document), perform OCR and extract the text.
- If the file is a picture of a scene, a chart, or a diagram, describe it in detail. The description should be comprehensive enough to be used as a sales log update. For example, instead of "a chart", describe what the chart shows: "A bar chart showing Q3 sales growth, with product A at $50k, product B at $80k, and product C at $45k."

Analyze the following file and provide the full extracted text in the 'extractedText' field of the JSON output.

File: {{media url=fileDataUri}}`,
});

const extractTextFromFileFlow = ai.defineFlow(
  {
    name: 'extractTextFromFileFlow',
    inputSchema: ExtractTextFromFileInputSchema,
    outputSchema: ExtractTextFromFileOutputSchema,
  },
  async input => {
    const {output} = await extractTextFromFilePrompt(input);
    return output!;
  }
);

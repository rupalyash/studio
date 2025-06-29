'use server';

/**
 * @fileOverview Defines a tool for fetching the latest news for a given industry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Mock function to simulate fetching news articles.
// In a real application, this would call a News API.
async function fetchNewsForIndustry(industry: string) {
  console.log(`Fetching mock news for industry: ${industry}`);
  // Return a set of mock articles.
  return [
    {
      title: `Breakthrough in ${industry}: AI Drives Unprecedented Growth`,
      url: `https://mock-news.com/${industry.toLowerCase().trim().replace(/\s+/g, '-')}/ai-growth`,
      content: `The ${industry} sector is experiencing a significant transformation, driven by advancements in artificial intelligence. Companies are leveraging machine learning to optimize operations, personalize customer experiences, and predict market trends with stunning accuracy. This has led to a 25% increase in efficiency across the board.`,
    },
    {
      title: `Regulatory Changes on the Horizon for the ${industry} Industry`,
      url: `https://mock-news.com/${industry.toLowerCase().trim().replace(/\s+/g, '-')}/regulatory-changes`,
      content: `Governments worldwide are preparing new regulations for the ${industry} industry, focusing on data privacy and consumer protection. Experts suggest these changes could reshape the competitive landscape, favoring companies with robust compliance frameworks already in place.`,
    },
    {
      title: `Sustainability Becomes a Core Focus in ${industry} Strategies`,
      url: `https://mock-news.com/${industry.toLowerCase().trim().replace(/\s+/g, '-')}/sustainability-focus`,
      content: `A new report indicates that sustainability is no longer a peripheral concern but a central pillar of strategy for leading firms in the ${industry} space. Investment in green technology and ethical sourcing is projected to double in the next five years, driven by consumer demand and investor pressure.`,
    },
  ];
}

const NewsArticleSchema = z.object({
  title: z.string().describe('The title of the article.'),
  url: z.string().url().describe('The URL of the article.'),
  content: z.string().describe('The full content of the article.'),
});

export const getLatestNews = ai.defineTool(
  {
    name: 'getLatestNews',
    description: 'Returns a list of recent news articles for a specified industry. Use this to gather information before summarizing market trends.',
    inputSchema: z.object({
      industry: z.string().describe('The industry to fetch news for (e.g., "Technology", "Healthcare").'),
    }),
    outputSchema: z.array(NewsArticleSchema),
  },
  async (input) => {
    return fetchNewsForIndustry(input.industry);
  }
);

import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data
  const mockAnalytics = [
    {
      format: 'linkedin',
      wordCount: 45,
      engagementScore: 78,
      readabilityScore: 65,
      tone: 'Professional',
      sentiment: 'Positive',
      keyTopics: ['SEO', 'Marketing'],
      suggestions: ['Use more hashtags', 'Mention a trending topic'],
    },
    {
      format: 'twitter',
      wordCount: 45,
      engagementScore: 78,
      readabilityScore: 65,
      tone: 'Professional',
      sentiment: 'Positive',
      keyTopics: ['SEO', 'Marketing'],
      suggestions: ['Use more hashtags', 'Mention a trending topic'],
    },
    {
      format: 'email',
      wordCount: 150,
      engagementScore: 60,
      readabilityScore: 85,
      tone: 'Casual',
      sentiment: 'Neutral',
      keyTopics: ['Customer Retention', 'Offers'],
      suggestions: ['Make subject line more engaging', 'Shorten the email body'],
    },
    {
      format: 'article',
      wordCount: 350,
      engagementScore: 85,
      readabilityScore: 12,
      tone: 'Informative',
      sentiment: 'Positive',
      keyTopics: ['Growth Hacking', 'Startups'],
      suggestions: ['Add a strong conclusion', 'Include a call-to-action'],
    },
  ];

  return NextResponse.json(mockAnalytics);
}

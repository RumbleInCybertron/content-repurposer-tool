import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data
  const mockAnalytics = [
    {
      format: 'linkedin',
      wordCount: 45,
      engagementScore: 78,
      suggestions: ['Use more hashtags', 'Mention a trending topic'],
    },
    {
      format: 'email',
      wordCount: 150,
      engagementScore: 60,
      suggestions: ['Make subject line more engaging', 'Shorten the email body'],
    },
    {
      format: 'article',
      wordCount: 350,
      engagementScore: 80,
      suggestions: ['Add a strong conclusion', 'Include a call-to-action'],
    },
  ];

  return NextResponse.json(mockAnalytics);
}

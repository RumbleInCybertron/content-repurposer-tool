import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data
  const currentData = [
    { format: 'linkedin', engagementScore: 78 },
    { format: 'twitter', engagementScore: 55 },
    { format: 'email', engagementScore: 60 },
    { format: 'article', engagementScore: 85 },
  ];

  // Generate predictions by adding a small growth rate
  const predictedData = currentData.map((item) => ({
    format: item.format,
    currentEngagement: item.engagementScore,
    predictedEngagement: Math.round(item.engagementScore * (1 + Math.random() * 0.2)), // 0-20% increase
  }));

  return NextResponse.json(predictedData);
}

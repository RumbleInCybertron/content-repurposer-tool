import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
      throw new Error('Failed to publish tweet');
    }

    const tweet = await response.json();
    return NextResponse.json({ status: 'Published successfully', tweet });
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error publishing to Twitter:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  }
}

import { NextResponse } from 'next/server';
import { redis } from '../../../../utils/redisClient';
import { refreshAccessToken } from '../../../../utils/twitterAuth';

interface TwitterTokens {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  scope: string;
}

export async function POST(req: Request) {
  const { state, content } = await req.json();

  if (!state || !content) {
    return NextResponse.json({ error: 'State or content is missing' }, { status: 400 });
  }

  // Retrieve tokens from Redis
  const tokens = (await redis.get(`twitter_tokens:${state}`)) as string | null;
  if (!tokens) {
    return NextResponse.json({ error: 'Tokens not found' }, { status: 404 });
  }

  const parsedTokens = JSON.parse(tokens) as TwitterTokens;
  
  console.log(parsedTokens.access_token);

  // Refresh tokens if expired
  if (parsedTokens.expires_in < Date.now() / 1000) {
    const refreshedTokens = await refreshAccessToken(parsedTokens.refresh_token);
    await redis.set(`twitter_tokens:${state}`, JSON.stringify(refreshedTokens), { ex: refreshedTokens.expires_in });
    parsedTokens.access_token = refreshedTokens.access_token;
  }
  
  try {
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${parsedTokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
      throw new Error('Failed to publish tweet');
    }

    const tweet = await response.json();
    return NextResponse.json({ status: 'Tweet published successfully', tweet });
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error publishing to Twitter:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  }
}

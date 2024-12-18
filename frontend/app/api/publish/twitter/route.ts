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
  try {
    const { state, content } = await req.json();
    console.log('Received content for Twitter:', content);
    console.log('Received state for Twitter:', state);
    const savedState = await redis.get('oauth_state');
    console.log('Saved state in Redis:', savedState);
    console.log('Received state from frontend:', state);

    if (!state && !savedState) return NextResponse.json({ error: 'State is missing or invalid' }, { status: 401 });
    if (state !== savedState) return NextResponse.json({ error: 'State mismatch' }, { status: 401 });
    if (!content) return NextResponse.json({ error: 'Content is missing' }, { status: 400 });

    // Retrieve tokens from Redis
    const tokens = (await redis.get(`twitter_tokens:${state}`)) as string | null;
    console.log('Raw Tokens from Redis:', tokens);
    if (!tokens) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Check if tokens are a string or object
    const parsedTokens =
      typeof tokens === 'string' ? (JSON.parse(tokens) as TwitterTokens) : tokens;
    
    console.log('Parsed Tokens:', parsedTokens);
    console.log(parsedTokens.access_token);

    if (!parsedTokens.access_token) {
      return NextResponse.json({ error: 'Access token missing' }, { status: 401 });
    }

    // Refresh tokens if expired
    if (parsedTokens.expires_in < Date.now() / 1000) {
      const refreshedTokens = await refreshAccessToken(parsedTokens.refresh_token);
      await redis.set(`twitter_tokens:${state}`, JSON.stringify(refreshedTokens), { ex: refreshedTokens.expires_in });
      parsedTokens.access_token = refreshedTokens.access_token;
    }
    
    // Publish content to Twitter
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${parsedTokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twitter API Error:', errorData);
      return NextResponse.json({ error: 'Failed to publish to Twitter', details: errorData }, { status: 500 });
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

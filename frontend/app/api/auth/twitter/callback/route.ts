import { NextResponse } from 'next/server';
import { redis } from '../../../../../utils/redisClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json({ error: 'Authorization code or state is missing' }, { status: 400 });
  }

  // Retrieve the code_verifier from the cookies
  const cookies = request.headers.get('cookie') || '';
  const codeVerifier = cookies.split(';').find((cookie) => cookie.trim().startsWith('code_verifier='))?.split('=')[1];

  if (!codeVerifier) {
    return NextResponse.json({ error: 'Code verifier is missing' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    const tokens = await response.json();

    await redis.set(`twitter_tokens:${state}`, JSON.stringify(tokens), { ex: tokens.expires_in });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?status=connected&platform=twitter`);
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during token exchange:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  }
}

import { NextResponse } from 'next/server';
import { redis } from '../../../../../utils/redisClient';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state');
  const code = searchParams.get('code');

  // Retrieve state and code_verifier from Redis
  const storedState = await redis.get('oauth_state');
  const codeVerifier = await redis.get('code_verifier') as string | null;

  if (state !== storedState) {
    return NextResponse.json({ error: 'State mismatch' }, { status: 401 });
  }

  if (!codeVerifier) {
    return NextResponse.json({ error: 'Code verifier missing or expired' }, { status: 400 });
  }

  if (!code || !state) {
    return NextResponse.json({ error: 'Authorization code or state is missing' }, { status: 400 });
  }

  // // Retrieve the code_verifier from the cookies
  // const cookies = req.headers.get('cookie') || '';
  // console.log('Cookies received:', cookies);

  // const savedState = cookies.split(';').find((cookie) => cookie.trim().startsWith('state='))?.split('=')[1];
  // console.log('Saved State from cookie:', savedState);
  // console.log('Stored State:', storedState);

  // const codeVerifier = cookies.split(';').find((cookie) => cookie.trim().startsWith('code_verifier='))?.split('=')[1];


  // if (!savedState || !codeVerifier) {
  //   return NextResponse.json({ error: 'State or code verifier is missing in cookies' }, { status: 400 });
  // }

  // // Validate state
  // if (savedState !== storedState) {
  //   return NextResponse.json({ error: 'State mismatch detected' }, { status: 403 });
  // }

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
        grant_type: 'authorization_code',
        code: code!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`!,
        client_id: process.env.TWITTER_CLIENT_ID!,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    const tokens = await response.json();

    await redis.set(`twitter_tokens:${storedState}`, JSON.stringify(tokens), { ex: tokens.expires_in });

    console.log('Redirecting with state:', state);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?status=connected&platform=twitter&state=${state}`);
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during token exchange:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  }
}

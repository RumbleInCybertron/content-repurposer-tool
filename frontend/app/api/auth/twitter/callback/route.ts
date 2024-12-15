import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
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
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    const tokens = await response.json();

    // TODO Save tokens to database or session
    return NextResponse.json({ tokens });
  } catch (error: unknown) {
      if (error instanceof Error)
        return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
  }

  console.log('Client ID:', process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID)
  console.log('Client Secret:', process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET)
  console.log('Redirect_URI:', process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI)

  try {
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
        client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET!,
      }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error_description }, { status: 400 });
    }

    // TODO: Store the access token (in a secure database or session in production)
    const accessToken = data.access_token;

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 500 });
  }
}

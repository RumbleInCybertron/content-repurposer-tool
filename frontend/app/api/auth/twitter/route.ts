import { NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: 'state_token',
  });

  return NextResponse.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
}

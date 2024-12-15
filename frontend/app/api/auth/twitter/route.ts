import { NextResponse } from 'next/server';
import { generatePkce, generateRandomString } from '../../../../utils/pkce';

export async function GET() {
  const { codeVerifier, codeChallenge } = await generatePkce();

  const headers = new Headers();
  headers.set('Set-Cookie', `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
    state: generateRandomString(32), // Random string for CSRF protection
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    scope: 'tweet.read tweet.write users.read offline.access',
  });

  return NextResponse.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`, {
    headers,
  });
}

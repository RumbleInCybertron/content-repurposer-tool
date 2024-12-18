import { NextResponse } from 'next/server';
import { generatePkce, generateRandomString } from '../../../../utils/pkce';
import { redis } from '../../../../utils/redisClient'; 

export async function GET() {
  const { codeVerifier, codeChallenge } = await generatePkce();

  // Generate a secure random state for CSRF protection
  const state = generateRandomString(32);

  // Save code_verifier and state to Redis
  await redis.set('code_verifier', codeVerifier, { ex: 300 }); // Expiry of 5 minutes
  console.log('Saving state to Redis:', state);
  await redis.set('oauth_state', state, { ex: 300 }); // Expiry of 5 minutes

  // // Set both code_verifier and state in cookies
  // const headers = new Headers();
  // headers.append(
  //   'Set-Cookie',
  //   `code_verifier=${codeVerifier}; Path=/; HttpOnly; SameSite=Lax`
  // );
  // headers.append(
  //   'Set-Cookie',
  //   `state=${state}; Path=/; HttpOnly; SameSite=Lax`
  // );

  // Build Twitter authorization URL
  const twitterAuthURL = `https://twitter.com/i/oauth2/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
    scope: 'tweet.read tweet.write users.read offline.access',
    state, // Pass the generated state
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })}`;

  return NextResponse.redirect(twitterAuthURL);
}

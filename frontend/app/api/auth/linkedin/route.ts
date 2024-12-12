import { NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
    scope: 'w_member_social r_liteprofile',
  });
  console.log('Client ID:', process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID)
  console.log('Client Secret:', process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET)
  console.log('Redirect_URI:', process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI)

  return NextResponse.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  );
}

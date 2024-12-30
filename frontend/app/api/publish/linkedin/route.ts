import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { content, accessToken } = await req.json();

  if (!content || !accessToken) {
    return NextResponse.json({ error: 'Content or access token missing' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: 'urn:li:person:{YOUR_PERSON_ID}', // Replace with the actual person ID
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error }, { status: res.status });
    }

    return NextResponse.json({ status: 'Content published to LinkedIn' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to publish content' }, { status: 500 });
  }
}

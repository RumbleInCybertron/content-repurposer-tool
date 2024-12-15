import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { format, content } = await req.json();

  // Mock response for publishing
  if (format === 'linkedin') {
    return NextResponse.json({ status: `Content published to LinkedIn: "${content}"` });
  }
  if (format === 'twitter') {
    return NextResponse.json({ status: `Content published to Twitter: "${content}"` });
  }

  return NextResponse.json(
    { status: 'Publishing failed: Unsupported format' },
    { status: 400 }
  );
}

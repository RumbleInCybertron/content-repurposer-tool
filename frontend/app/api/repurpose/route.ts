import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { content, format } = await req.json();

  // Define mock responses for each format
  const mockResponses: Record<string, string> = {
    linkedin: `Mock LinkedIn post for: ${content}`,
    email: `Mock email draft for: ${content}`,
    article: `Mock short-form article for: ${content}`,
  };

  const output = mockResponses[format] || 'Unsupported format';
  return NextResponse.json({ output });
}

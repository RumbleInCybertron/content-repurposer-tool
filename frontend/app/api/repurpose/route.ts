import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { content, formats } = await req.json();

  // Validate that formats is an array
  if (!Array.isArray(formats) || formats.length === 0) {
    return NextResponse.json(
      { error: 'At least one format must be selected' },
      { status: 400 }
    );
  }

  // Define mock responses for each format
  const mockResponses: Record<string, string> = {
    linkedin: `Mock LinkedIn post for: ${content}`,
    email: `Mock email draft for: ${content}`,
    article: `Mock short-form article for: ${content}`,
  };

  // Generate responses for all selected formats
  const outputs = formats.reduce((acc, format) => {
    acc[format] = mockResponses[format] || 'Unsupported format';
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json({ outputs });
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content, formats } = await req.json();

    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate formats
    if (!Array.isArray(formats) || formats.length === 0) {
      return NextResponse.json(
        { error: 'At least one format must be selected' },
        { status: 400 }
      );
    }

    // Define mock responses for each format
    const mockResponses: Record<string, (content: string) => string> = {
      linkedin: (content) => `Mock LinkedIn post for: ${content}`,
      twitter: (content) =>
        content.length > 280
          ? content.slice(0, 277) + '...' // Enforce character limit
          : content,
      email: (content) => `Mock email draft for: ${content}`,
      article: (content) => `Mock short-form article for: ${content}`,
    };

    // Generate responses for all selected formats
    const outputs = formats.reduce((acc, format) => {
      if (mockResponses[format]) {
        acc[format] = mockResponses[format](content);
      } else {
        acc[format] = 'Unsupported format'; // Handle unsupported formats
      }
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ outputs });
  } catch (error) {
    console.error('Error processing repurpose request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

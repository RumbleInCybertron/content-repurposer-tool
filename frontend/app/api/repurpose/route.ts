import { NextResponse } from 'next/server';
import {
  formatForTwitter,
  formatForLinkedIn,
  formatForEmail,
  formatForArticle
 } from '../../../utils/platformFormatting';

export async function POST(req: Request) {
  try {
    const { content, formats } = await req.json();
    console.log('Received request body:', { content, formats });

    // Validate content and formats
    if (
        !content || 
        typeof content !== 'string' || 
        !Array.isArray(formats) || 
        formats.length === 0
      ) {
      return NextResponse.json(
        { error: 'Content is required and must be a string or formats missing' },
        { status: 400 }
      );
    }

    console.log('Received request:', { content, formats });

    // // Define mock responses for each format
    // const mockResponses: Record<string, (content: string) => string> = {
    //   linkedin: (content) => `Mock LinkedIn post for: ${content}`,
    //   twitter: (content) =>
    //     content.length > 280
    //       ? content.slice(0, 277) + '...' // Enforce character limit
    //       : content,
    //   email: (content) => `Mock email draft for: ${content}`,
    //   article: (content) => `Mock short-form article for: ${content}`,
    // };

    // const normalizedFormats = formats.map((format) => format.toLowerCase());

    // Generate outputs selected formats
    const outputs = formats.reduce((acc: Record<string, string>, format: string) => {
      switch (format) {
        case 'twitter':
          acc[format] = formatForTwitter(content);
          break;
        case 'linkedin':
          acc[format] = formatForLinkedIn(content);
          break;
        case 'email': {
          const { subject, body } = formatForEmail(content);
          acc[format] = `Subject: ${subject}\n\n${body}`;
          break;
        }
        case 'article':
          acc[format] = formatForArticle(content);
          break;
        default:
          acc[format] = 'Unsupported format';
      }
      return acc;
    }, {});

    return NextResponse.json({ outputs });
  } catch (error) {
    console.error('Error processing repurpose request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

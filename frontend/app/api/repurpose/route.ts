import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { content } = await req.json();
  
  // Check if running in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({
      output: `Mock response for: ${content}`,
    });
  }

  // Use OpenAI in production
  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Repurpose this content for a LinkedIn post: ${content}` },
      ],
      max_tokens: 150,
    });

    const output = response.choices[0]?.message?.content || 'No output generated';
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error during OpenAI request:', error);
    return NextResponse.json(
      { error: 'Failed to process content' },
      { status: 500 }
    );
  }
}

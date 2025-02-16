import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['businessName', 'contactName', 'email', 'phone', 'address', 'challengeTitle', 'category', 'difficulty', 'estimatedTime', 'points', 'description', 'tasks'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Simulate a short delay to make the UI feel more natural
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      success: true,
      message: 'Challenge submission received successfully'
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process challenge submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
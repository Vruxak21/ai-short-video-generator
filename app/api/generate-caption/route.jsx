import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

// In generate-caption/route.jsx
export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json();
    const client = new AssemblyAI({
      apiKey: process.env.CAPTION_API,
    });
    
    const data = {
      audio: audioFileUrl
    };
    
    // Add timeout configuration
    const transcript = await client.transcripts.transcribe(data, {
      fetchOptions: {
        timeout: 30000 // Increase timeout to 30 seconds
      }
    });

    console.log(transcript.words); 
    return NextResponse.json({ result: transcript.words });
  } catch (e) {
    console.error("Detailed Error:", e);
    return NextResponse.json({ 
      error: e.message, 
      details: e.toString() 
    }, { status: 500 });
  }
}
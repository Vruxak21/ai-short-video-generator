import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import supabase from "C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/configs/SupabaseConfig";  // Import your Supabase client

const fs = require('fs');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();
  
  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", ssmlGender: "MALE" },
    audioConfig: { audioEncoding: "MP3" },
  };
  
  const [response] = await client.synthesizeSpeech(request);
  const audioBuffer = Buffer.from(response.audioContent, "binary");

  const filePath = `${id}.mp3`; 
  const { error } = await supabase.storage
    .from("ai-short-video-files") 
    .upload(filePath, audioBuffer, { contentType: "audio/mp3" });

  if (error) {
    console.error("Supabase Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("ai-short-video-files").getPublicUrl(filePath);
  console.log("Download URL:", data.publicUrl);

  return NextResponse.json({ Result: data.publicUrl });
}

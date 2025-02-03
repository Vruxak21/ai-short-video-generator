import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const fs = require("fs");
const util = require("util");

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  try {
    const { text, id } = await req.json();

    const request = {
      input: { text: text },
      voice: { languageCode: "en-US", ssmlGender: "MALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioBuffer = Buffer.from(response.audioContent, "binary");

    const filePath = `audio/${id}.mp3`;
    const { error } = await supabase.storage
      .from("ai-short-video-files")
      .upload(filePath, audioBuffer, { contentType: "audio/mp3" });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("ai-short-video-files").getPublicUrl(filePath);
    console.log("Download URL:", publicUrl);

    return NextResponse.json({ result: publicUrl });
  } catch (error) {
    console.error("Error generating audio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

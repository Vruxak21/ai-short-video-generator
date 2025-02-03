import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      throw new Error("Missing prompt in request.");
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );

    if (!output || output.length === 0) {
      throw new Error("No image received from Replicate API.");
    }

    const base64Image = "data:image/png;base64," + await ConvertImage(output[0]);

    const fileName = `images/${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from("ai-short-video-files")
      .upload(fileName, Buffer.from(base64Image.split(",")[1], "base64"), {
        contentType: "image/png",
      });

    if (error) {
      throw new Error("Supabase upload failed: " + error.message);
    }

    const { data: { publicUrl } } = supabase.storage.from("ai-short-video-files").getPublicUrl(fileName);
    
    console.log(`Image Public URL for prompt "${prompt}":`, publicUrl);

    return NextResponse.json({ result: publicUrl });

  } catch (e) {
    console.error("Error generating image:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

const ConvertImage = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(resp.data).toString("base64");
  } catch (e) {
    console.error("Error converting image:", e);
    throw new Error("Image conversion failed.");
  }
};
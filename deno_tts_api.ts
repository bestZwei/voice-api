import { serve } from "https://deno.land/std/http/server.ts";
import { EdgeSpeechTTS } from "https://esm.sh/@lobehub/tts@1";

const AUTH_TOKEN = Deno.env.get("AUTH_TOKEN");
const VOICES_URL = "https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4";

async function fetchVoiceList() {
  const response = await fetch(VOICES_URL);
  const voices = await response.json();
  return voices.reduce((acc: Record<string, { model: string, name: string, friendlyName: string, locale: string }[]>, voice: any) => {
    const { ShortName: model, ShortName: name, FriendlyName: friendlyName, Locale: locale } = voice;
    if (!acc[locale]) acc[locale] = [];
    acc[locale].push({ model, name, friendlyName, locale });
    return acc;
  }, {});
}

async function synthesizeSpeech(model: string, voice: string, text: string) {
  const voiceName = model;
  const params = Object.fromEntries(
    voice.split("|").map((p) => p.split(":") as [string, string])
  );
  const rate = Number(params["rate"] || 0);
  const pitch = Number(params["pitch"] || 0);

  const tts = new EdgeSpeechTTS();
  
  const payload = {
    input: text,
    options: { 
      rate: rate,
      pitch: pitch,
      voice: voiceName
     },
  };
  const response = await tts.create(payload);
  const mp3Buffer = new Uint8Array(await response.arrayBuffer());

  console.log(`Successfully synthesized speech, returning audio/mpeg response`);
  return new Response(mp3Buffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}

function unauthorized(req: Request) {
  const authHeader = req.headers.get("Authorization");
  return AUTH_TOKEN && authHeader !== `Bearer ${AUTH_TOKEN}`;
}

async function handleSynthesisRequest(req: Request) {
  if (unauthorized(req)) {
    console.log("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method !== "GET") {
    console.log(`Invalid method ${req.method}, expected GET`);
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const model = url.searchParams.get("model");
  const input = url.searchParams.get("input");
  const voice = url.searchParams.get("voice");

  if (!model || !input || !voice) {
    console.log("Missing required parameters");
    return new Response("Bad Request", { status: 400 });
  }

  console.log(`Synthesis request with model=${model}, input=${input}, voice=${voice}`);

  return synthesizeSpeech(model, voice, input);
}

serve(async (req) => {
  try {
    const url = new URL(req.url);

    if (url.pathname !== "/v1/audio/speech") {
      console.log(`Unhandled path ${url.pathname}`);
      return new Response("Not Found", { status: 404 });
    }

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    const response = await handleSynthesisRequest(req);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  } catch (err) {
    console.error(`Error processing request: ${err.message}`);
    return new Response(`Internal Server Error\n${err.message}`, {
      status: 500,
    });
  }
});

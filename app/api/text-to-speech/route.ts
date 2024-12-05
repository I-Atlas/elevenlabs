import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = request.headers.get("Authorization");
  if (!apiKey) {
    console.error("API key is missing in Authorization header");
    return NextResponse.json(
      { error: "API key is missing in Authorization header" },
      { status: 401 },
    );
  }

  try {
    const { text, voice } = await request.json();
    if (!text || !voice) {
      return NextResponse.json(
        { error: "Text and voice are required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.7,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      const errorMessage =
        errorData.detail?.message ||
        "This generation failed completely and totally";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({ audio: audioBase64 });
  } catch (error) {
    console.error("Error generating audio:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

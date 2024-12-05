export interface PostTtsParams {
  voiceId: string;
  apiKey: string;
  text: string;
  modelId?: string;
  speakerBoost?: boolean;
  similarity?: number;
  stability?: number;
}

export const postTts = async ({
  voiceId,
  apiKey,
  text,
  similarity = 0.7,
  speakerBoost = true,
  stability = 0.6,
  modelId = "eleven_multilingual_v2",
}: PostTtsParams): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability: stability,
            similarity_boost: similarity,
            use_speaker_boost: speakerBoost,
          },
        }),
      },
    );

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer).toString("base64");
  } catch (error) {
    const errorMessage =
      (error as Error)?.message || "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

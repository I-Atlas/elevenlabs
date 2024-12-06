export interface PostAddVoiceParams {
  apiKey: string;
  name: string;
  publicUserId: string;
  publicVoiceId: string;
}

export const postAddVoice = async ({
  apiKey,
  name,
  publicUserId,
  publicVoiceId,
}: PostAddVoiceParams): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/voices/add/${publicUserId}/${publicVoiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          new_name: name,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.detail?.message || "An unknown error occurred";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.voice_id;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

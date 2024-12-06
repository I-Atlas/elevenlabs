import { Voice } from "@/app/types/voice";

export interface GetVoicesParams {
  apiKey: string;
}

export const getVoices = async ({
  apiKey,
}: GetVoicesParams): Promise<Voice[]> => {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.detail?.message || "An unknown error occurred";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

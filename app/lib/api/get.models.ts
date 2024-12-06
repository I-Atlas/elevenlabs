import { Model } from "@/app/types/model";

export interface GetModelsParams {
  apiKey: string;
}

export const getModels = async ({
  apiKey,
}: GetModelsParams): Promise<Model[]> => {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/models", {
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

    return await response.json();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

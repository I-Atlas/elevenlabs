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

    return await response.json();
  } catch (error) {
    const errorMessage =
      (error as Error)?.message || "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

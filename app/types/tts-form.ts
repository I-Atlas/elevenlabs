import { UseFormReturnType } from "@mantine/form";

export type TtsFromValues = {
  apiKey: string;
  text: string;
  voice: string;
  model: string;
  stability: number;
  similarity: number;
  voicePresetId: string;
};

export type TtsFormTransformValues = (values: {
  apiKey: string;
  text: string;
  voice: string;
  model: string;
  stability: number;
  similarity: number;
  voicePresetId: string;
}) => {
  apiKey: string;
  text: string;
  voice: string;
  model: string;
  stability: number;
  similarity: number;
  voicePresetId: string;
};

export type TtsForm = UseFormReturnType<TtsFromValues, TtsFormTransformValues>;

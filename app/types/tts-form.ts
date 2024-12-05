import { UseFormReturnType } from "@mantine/form";

export type TtsFromValues = {
  apiKey: string;
  text: string;
  voice: string;
  model: string;
  stability: number;
  similarity: number;
};

export type TtsFormTransformValues = (values: {
  apiKey: string;
  text: string;
  voice: string;
  model: string;
  stability: number;
  similarity: number;
}) => {
  apiKey: string;
  text: string;
  voice: string;
  model: string;
  stability: number;
  similarity: number;
};

export type TtsForm = UseFormReturnType<TtsFromValues, TtsFormTransformValues>;

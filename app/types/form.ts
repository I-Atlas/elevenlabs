import { UseFormReturnType } from "@mantine/form";

export type TtsFromValues = {
  apiKey: string;
  text: string;
  selectedVoice: string;
};

export type TtsFormTransformValues = (values: {
  apiKey: string;
  text: string;
  selectedVoice: string;
}) => {
  apiKey: string;
  text: string;
  selectedVoice: string;
};

export type TtsForm = UseFormReturnType<TtsFromValues, TtsFormTransformValues>;

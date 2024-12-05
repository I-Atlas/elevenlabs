import { createFormContext } from "@mantine/form";
import { TtsFromValues } from "@/app/types/tts-form";

export const [TtsFormProvider, useTtsFormContext, useTtsForm] =
  createFormContext<TtsFromValues>();

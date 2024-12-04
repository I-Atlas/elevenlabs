import { Textarea } from "@mantine/core";
import React, { FC } from "react";
import { TtsForm } from "@/app/types/form";
import { MAX_CHARACTERS_PER_GENERATION } from "@/app/constants/tts";

interface TtsTextareaProps {
  isDisabled?: boolean;
  form: TtsForm;
}

export const TtsTextarea: FC<TtsTextareaProps> = ({ isDisabled, form }) => {
  return (
    <Textarea
      placeholder="Что вы хотите, чтобы модель сказала?"
      {...form.getInputProps("text")}
      maxLength={MAX_CHARACTERS_PER_GENERATION}
      disabled={isDisabled}
      minRows={10}
      variant="unstyled"
      size="lg"
      w="100%"
      styles={{
        input: {
          height: "calc(100vh - 220px)",
          border: "none",
        },
      }}
    />
  );
};

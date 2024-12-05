import { Textarea } from "@mantine/core";
import React, { FC } from "react";
import { MAX_CHARACTERS_PER_GENERATION } from "@/app/constants/tts";
import { useTtsFormContext } from "@/app/context/tts-from";

interface TextAreaProps {
  isDisabled?: boolean;
}

export const TextArea: FC<TextAreaProps> = () => {
  const form = useTtsFormContext();
  return (
    <Textarea
      placeholder={
        !!form.values.apiKey
          ? "Что вы хотите, чтобы модель сказала?"
          : "Чтобы начать, введите API ключ в меню настроек"
      }
      {...form.getInputProps("text")}
      maxLength={MAX_CHARACTERS_PER_GENERATION}
      minRows={10}
      variant="unstyled"
      size="lg"
      w="100%"
      radius="xs"
      styles={{
        input: {
          height: "calc(100vh - 192px)",
          border: "none",
        },
      }}
    />
  );
};

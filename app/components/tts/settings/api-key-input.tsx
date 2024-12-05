import { TextInput } from "@mantine/core";
import React, { FC } from "react";
import { useTtsFormContext } from "@/app/context/tts-from";

export const ApiKeyInput: FC = () => {
  const form = useTtsFormContext();

  return (
    <TextInput
      color="rgba(77, 77, 255, 1)"
      radius="xl"
      size="md"
      label="API ключ"
      description="Необходимо обновлять каждые 10.000 символов"
      {...form.getInputProps("apiKey")}
    />
  );
};

import { Select, Stack, TextInput } from "@mantine/core";
import React, { FC } from "react";
import { TtsForm } from "@/app/types/form";
import { Voice } from "@/app/types/voice";

interface TtsSettingsProps {
  isDisabled?: boolean;
  form: TtsForm;
  voices: Voice[];
}

export const TtsSettings: FC<TtsSettingsProps> = ({
  isDisabled,
  form,
  voices,
}) => {
  return (
    <Stack gap="16px">
      <TextInput
        color="rgba(77, 77, 255, 1)"
        radius="xl"
        size="md"
        label="API ключ"
        description="Необходимо обновлять каждые 10.000 символов"
        {...form.getInputProps("apiKey")}
      />

      <Select
        color="rgba(77, 77, 255, 1)"
        radius="xl"
        size="md"
        label="Выбор голоса"
        description="Если в списке нет нужного голоса, его нужно добавить в аккаунт"
        data={voices.map((voice) => ({
          value: voice.voice_id,
          label: voice.name,
        }))}
        {...form.getInputProps("selectedVoice")}
        disabled={isDisabled}
      />
    </Stack>
  );
};

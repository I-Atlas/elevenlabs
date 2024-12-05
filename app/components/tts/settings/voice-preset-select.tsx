import React, { FC } from "react";
import { useTtsFormContext } from "@/app/context/tts-from";
import { Select } from "@mantine/core";
import { createPresetId } from "@/app/lib/utils/create-preset-id";

export const voicePresetData = [
  {
    name: "Joe",
    publicUserId:
      "836701f99bab484f5e1bff8e9df42d970fe56c858d8b9d99ea8443e7dffede63",
    publicVoiceId: "H75XqkaR3ZZS0BbFLXAL",
  },
];

export const VoicePresetSelect: FC = () => {
  const form = useTtsFormContext();

  return (
    <Select
      color="rgba(77, 77, 255, 1)"
      radius="xl"
      size="md"
      label="Выбор пресета голоса"
      description="Автоматически добавляет в аккаунт голос из библиотеки"
      data={voicePresetData?.map((voice) => ({
        value: createPresetId(voice),
        label: voice.name,
      }))}
      {...form.getInputProps("voicePresetId")}
    />
  );
};

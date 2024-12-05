import { Select } from "@mantine/core";
import React, { FC, useEffect } from "react";
import { Voice } from "@/app/types/voice";
import { useTtsFormContext } from "@/app/context/tts-from";
import { useQuery } from "@tanstack/react-query";
import { getVoices } from "@/app/lib/api/get.voices";

interface VoiceSelectProps {
  apiKey: string;
}

export const VoiceSelect: FC<VoiceSelectProps> = ({ apiKey }) => {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["voices", apiKey],
    queryFn: () => getVoices({ apiKey }),
    enabled: !!apiKey,
  });
  const form = useTtsFormContext();

  useEffect(() => {
    if (data) {
      const joeVoice = data.find((voice: Voice) => voice.name === "Joe");
      form.setFieldValue("voice", joeVoice?.voice_id || data[0]?.voice_id);
    }

    if (error) {
      form.setFieldError("voice", String(error) || "An unknown error occurred");
    }
  }, [data, error]);

  return (
    <Select
      color="rgba(77, 77, 255, 1)"
      radius="xl"
      size="md"
      label="Выбор голоса"
      description="Если в списке нет нужного голоса, его нужно добавить в аккаунт"
      data={data?.map((voice) => ({
        value: voice.voice_id,
        label: voice.name,
      }))}
      {...form.getInputProps("voice")}
      disabled={!isSuccess}
    />
  );
};

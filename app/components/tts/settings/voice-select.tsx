import { Select } from "@mantine/core";
import React, { FC, useEffect } from "react";
import { useTtsFormContext } from "@/app/context/tts-from";
import { useQuery } from "@tanstack/react-query";
import { getVoices } from "@/app/lib/api/get.voices";
import { postAddVoice } from "@/app/lib/api/post.add-voice";

interface VoiceSelectProps {
  apiKey: string;
}

export const VoiceSelect: FC<VoiceSelectProps> = ({ apiKey }) => {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["voices", apiKey],
    queryFn: async () => {
      let presettedVoiceId = "";
      if (!!form.values.voicePresetId) {
        const [name, publicUserId, publicVoiceId] =
          form.values.voicePresetId.split("|");
        presettedVoiceId = await postAddVoice({
          apiKey,
          name,
          publicVoiceId,
          publicUserId,
        });
      }

      const voices = await getVoices({ apiKey });
      return { voices, presettedVoiceId };
    },
    enabled: !!apiKey,
  });
  const form = useTtsFormContext();

  useEffect(() => {
    if (data) {
      form.setFieldValue(
        "voice",
        data.presettedVoiceId || data.voices[0]?.voice_id,
      );
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
      data={data?.voices?.map((voice) => ({
        value: voice.voice_id,
        label: voice.name,
      }))}
      {...form.getInputProps("voice")}
      disabled={!isSuccess}
    />
  );
};

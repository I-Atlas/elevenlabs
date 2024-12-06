"use client";

import { AppShell, Burger, Group, Stack, Text, Title } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import {
  MAX_CHARACTERS_PER_API_KEY,
  MAX_CHARACTERS_PER_GENERATION,
} from "@/app/constants/tts";
import { TtsFormProvider, useTtsForm } from "@/app/context/tts-from";
import { ApiKeyInput } from "@/app/components/tts/settings/api-key-input";
import { VoiceSelect } from "@/app/components/tts/settings/voice-select";
import { TextArea } from "@/app/components/tts/text-area";
import { Actions } from "@/app/components/tts/actions";
import { ModelSelect } from "@/app/components/tts/settings/model-select";
import { IpInfo } from "@/app/components/tts/settings/ip-info";
import { SimilaritySlider } from "@/app/components/tts/settings/similarity-slider";
import { StabilitySlider } from "@/app/components/tts/settings/stability-slider";
import { createPresetId } from "@/app/lib/utils/create-preset-id";
import {
  voicePresetData,
  VoicePresetSelect,
} from "@/app/components/tts/settings/voice-preset-select";

export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const [totalCharactersUsed, setTotalCharactersUsed] = useState<number>(0);
  const form = useTtsForm({
    initialValues: {
      apiKey: "",
      text: "",
      voice: "",
      model: "",
      stability: 60,
      similarity: 70,
      voicePresetId: createPresetId(voicePresetData[0]),
    },
    onValuesChange: (values) => {
      window.localStorage.setItem(
        "tts-form",
        JSON.stringify({
          apiKey: values.apiKey,
          stability: values.stability,
          similarity: values.similarity,
          voicePresetId: values.voicePresetId,
        }),
      );
    },
  });
  const [debouncedApiKey] = useDebouncedValue(form.values.apiKey, 1000);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const isDisabled =
    !debouncedApiKey ||
    !form.values.voice ||
    totalCharactersUsed >= MAX_CHARACTERS_PER_API_KEY;

  useEffect(() => {
    setTotalCharactersUsed(0);
  }, [debouncedApiKey]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem("tts-form");
    if (storedValue) {
      try {
        form.setValues(JSON.parse(window.localStorage.getItem("tts-form")!));
      } catch (error) {
        console.log((error as Error).message);
      }
    }
  }, []);

  return (
    <TtsFormProvider form={form}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title fz={18}>TTS ElevenLabs</Title>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Stack gap="16px">
            <ApiKeyInput />
            <ModelSelect apiKey={debouncedApiKey} />
            <VoiceSelect apiKey={debouncedApiKey} />
            <VoicePresetSelect />
            <SimilaritySlider />
            <StabilitySlider />
            <IpInfo />
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <Stack gap="16px">
            <TextArea />
            <Actions
              isGenerating={isGenerating}
              isDisabled={isDisabled}
              apiKey={debouncedApiKey}
              setIsGenerating={setIsGenerating}
              setTotalCharactersUsed={setTotalCharactersUsed}
            />
            <Group gap="4px" justify="space-between" align="center">
              <Text c="dimmed" size="md">
                {MAX_CHARACTERS_PER_API_KEY - totalCharactersUsed} символов
                осталось
              </Text>
              <Text c="dimmed" size="md">
                {form.values.text.length}/{MAX_CHARACTERS_PER_GENERATION}
              </Text>
            </Group>
          </Stack>
        </AppShell.Main>
      </AppShell>
    </TtsFormProvider>
  );
}

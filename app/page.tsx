"use client";

import { AppShell, Burger, Group, Stack, Text } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { TtsTextarea } from "./components/tts-textarea";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { Voice } from "@/app/types/voice";
import {
  MAX_CHARACTERS_PER_API_KEY,
  MAX_CHARACTERS_PER_GENERATION,
} from "@/app/constants/tts";
import { TtsSettings } from "@/app/components/tts-settings";
import { TtsActions } from "@/app/components/tts-actions";

export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [totalCharactersUsed, setTotalCharactersUsed] = useState<number>(0);
  const form = useForm({
    initialValues: {
      apiKey: "",
      text: "",
      selectedVoice: "",
    },
  });
  const [debouncedApiKey] = useDebouncedValue(form.values.apiKey, 1000);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const isDisabled =
    isGenerating ||
    !debouncedApiKey ||
    !form.values.selectedVoice ||
    totalCharactersUsed >= MAX_CHARACTERS_PER_API_KEY;

  useEffect(() => {
    const fetchVoices = async () => {
      if (!debouncedApiKey) return;
      try {
        const response = await fetch("/api/voices", {
          headers: {
            Authorization: debouncedApiKey,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to retrieve voices");
        }
        const joeVoice: Voice = data.voices?.find(
          (voice: Voice) => voice.name === "Joe",
        );
        setVoices(data.voices);
        form.setFieldValue(
          "selectedVoice",
          joeVoice.voice_id || data.voices[0].voice_id,
        );
      } catch (error) {
        form.setFieldError(
          "selectedVoice",
          String(error) || "An unknown error occurred",
        );
      }
    };

    fetchVoices();
  }, [debouncedApiKey]);

  useEffect(() => {
    setTotalCharactersUsed(0);
  }, [debouncedApiKey]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          TTS через 11Labs API
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <TtsSettings form={form} voices={voices} isDisabled={isDisabled} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="16px">
          <TtsTextarea isDisabled={isDisabled} form={form} />
          <Stack gap="4px">
            <Text
              c="dimmed"
              size="md"
            >{`Символов в тексте: ${form.values.text.length}/${MAX_CHARACTERS_PER_GENERATION}`}</Text>
            <Text
              c="dimmed"
              size="md"
            >{`Символов использовано: ${totalCharactersUsed}/${MAX_CHARACTERS_PER_API_KEY}`}</Text>
          </Stack>

          <TtsActions
            apiKey={debouncedApiKey}
            form={form}
            setIsGenerating={setIsGenerating}
            setTotalCharactersUsed={setTotalCharactersUsed}
            isDisabled={isDisabled}
            isGenerating={isGenerating}
          />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}

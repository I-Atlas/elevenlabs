import { ActionIcon, Button, Group } from "@mantine/core";
import React, { FC, useCallback, useState } from "react";
import {
  IconDownload,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useTtsFormContext } from "@/app/context/tts-from";
import { useMutation } from "@tanstack/react-query";
import { postTts } from "@/app/lib/api/post.tts";

interface ActionsProps {
  isDisabled?: boolean;
  isGenerating?: boolean;

  apiKey: string;

  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalCharactersUsed: React.Dispatch<React.SetStateAction<number>>;
}

export const Actions: FC<ActionsProps> = ({
  isDisabled,
  isGenerating,
  apiKey,
  setIsGenerating,
  setTotalCharactersUsed,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const form = useTtsFormContext();
  const [audioData, setAudioData] = useState<string | null>(null);
  const { mutate } = useMutation({
    mutationKey: ["voices"],
    mutationFn: () =>
      postTts({
        text: form.values.text,
        voiceId: form.values.voice,
        modelId: form.values.model,
        stability: form.values.stability / 10,
        similarity: form.values.similarity / 10,
        apiKey,
      }),
    onSuccess: (data) => {
      const audio = new Audio(`data:audio/mpeg;base64,${data}`);
      setAudioElement(audio);
      setAudioData(data);

      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);

      setTotalCharactersUsed((prev) => prev + form.values.text.length);
      setIsGenerating(false);
    },
    onError: (error) => {
      form.setFieldError(
        "text",
        String(error.message) || "An unknown error occurred",
      );
      setIsGenerating(false);
    },
  });

  const handlePlayPause = useCallback(() => {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  }, [audioElement, isPlaying]);

  const handleDownload = useCallback(() => {
    if (!audioData) return;
    const link = document.createElement("a");
    link.href = `data:audio/mpeg;base64,${audioData}`;
    link.download = "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [audioData]);

  return (
    <Group justify="center" grow gap="16px">
      <Button
        onClick={() => mutate()}
        disabled={!form.values.text.trim() || isDisabled}
        loading={isGenerating}
        variant="filled"
        size="md"
        radius="xl"
        color="rgba(77, 77, 255, 1)"
      >
        {isGenerating ? "Generating..." : "Generate"}
      </Button>

      {audioElement && (
        <>
          <ActionIcon
            size="xl"
            radius="xl"
            onClick={handlePlayPause}
            disabled={isDisabled}
            color="rgba(206, 255, 0, 1)"
          >
            {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
          </ActionIcon>
          <ActionIcon
            size="xl"
            radius="xl"
            onClick={handleDownload}
            disabled={isDisabled}
            color="rgba(206, 255, 0, 1)"
          >
            <IconDownload />
          </ActionIcon>
        </>
      )}
    </Group>
  );
};

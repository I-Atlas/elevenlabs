import { Button, Group } from "@mantine/core";
import React, { FC, useCallback, useState } from "react";
import { TtsForm } from "@/app/types/form";

interface TtsActionsProps {
  isDisabled?: boolean;
  isGenerating?: boolean;

  apiKey: string;
  form: TtsForm;

  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalCharactersUsed: React.Dispatch<React.SetStateAction<number>>;
}

export const TtsActions: FC<TtsActionsProps> = ({
  isDisabled,
  isGenerating,
  form,
  apiKey,
  setIsGenerating,
  setTotalCharactersUsed,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const [audioData, setAudioData] = useState<string | null>(null);
  const handleGenerateAudio = useCallback(async () => {
    if (!form.values.text.trim()) return;
    setIsGenerating(true);
    form.setFieldError("text", undefined);
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          text: form.values.text,
          voice: form.values.selectedVoice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate audio");
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      setAudioElement(audio);
      setAudioData(data.audio);

      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);

      setTotalCharactersUsed((prev) => prev + form.values.text.length);
    } catch (error) {
      form.setFieldError("text", String(error) || "An unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, [form.values.text, form.values.selectedVoice, apiKey]);

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
        onClick={handleGenerateAudio}
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
          <Button
            variant="filled"
            size="md"
            radius="xl"
            onClick={handlePlayPause}
            disabled={isDisabled}
            color="rgba(206, 255, 0, 1)"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            variant="filled"
            size="md"
            radius="xl"
            onClick={handleDownload}
            disabled={isDisabled}
            color="rgba(206, 255, 0, 1)"
          >
            Download
          </Button>
        </>
      )}
    </Group>
  );
};

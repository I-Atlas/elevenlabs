"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDebouncedValue } from "../hooks/use-debounce-value";

interface Voice {
  voice_id: string;
  name: string;
}

const TextToSpeech: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [debouncedApiKey] = useDebouncedValue(apiKey, 1000);
  const [text, setText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);

  const disabled = isGenerating || !debouncedApiKey || !selectedVoice;

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
        setSelectedVoice(joeVoice.voice_id || data.voices[0].voice_id);
      } catch (error) {
        setError(String(error) || "An unknown error occurred");
      }
    };

    fetchVoices();
  }, [debouncedApiKey]);

  const handleGenerateAudio = useCallback(async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: debouncedApiKey,
        },
        body: JSON.stringify({ text, voice: selectedVoice }),
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
    } catch (error) {
      setError(String(error) || "An unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, [text, selectedVoice, debouncedApiKey]);

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="api-key-input"
            className="block text-sm font-medium mb-2"
          >
            API Key
          </label>
          <input
            id="api-key-input"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full p-2 border rounded-md"
            aria-label="API Key"
          />
        </div>

        <div>
          <label
            htmlFor="voice-select"
            className="block text-sm font-medium mb-2"
          >
            Select Voice
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded-md"
            aria-label="Select Voice"
            disabled={disabled}
          >
            {voices.map((voice) => (
              <option key={voice.voice_id} value={voice.voice_id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="text-input"
            className="block text-sm font-medium mb-2"
          >
            Enter Text
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you want the model to say?"
            className="w-full h-32 p-2 border rounded-md resize-none"
            aria-label="Enter Text"
            disabled={disabled}
          />
        </div>

        {error && (
          <div
            className="text-red-500 text-sm p-2 bg-red-50 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleGenerateAudio}
            disabled={!text.trim() || disabled}
            className={`flex-1 px-4 py-2 rounded-md text-white ${
              !text.trim() || disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            aria-busy={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Audio"}
          </button>

          {audioElement && (
            <>
              <button
                onClick={handlePlayPause}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                aria-pressed={isPlaying}
                disabled={disabled}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                disabled={disabled}
              >
                Download
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;

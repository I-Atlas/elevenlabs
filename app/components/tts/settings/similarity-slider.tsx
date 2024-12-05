import { Slider, Stack, Text } from "@mantine/core";
import React, { FC } from "react";
import { useTtsFormContext } from "@/app/context/tts-from";

export const SimilaritySlider: FC = () => {
  const form = useTtsFormContext();

  return (
    <Stack gap="4px">
      <Text fw={500}>Схожесть</Text>
      <Slider
        color="rgba(77, 77, 255, 1)"
        {...form.getInputProps("similarity")}
      />
    </Stack>
  );
};

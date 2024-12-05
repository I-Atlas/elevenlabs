import { Slider, Stack, Text } from "@mantine/core";
import React, { FC } from "react";
import { useTtsFormContext } from "@/app/context/tts-from";

export const StabilitySlider: FC = () => {
  const form = useTtsFormContext();

  return (
    <Stack gap="4px">
      <Text fw={500}>Стабильность</Text>
      <Slider
        color="rgba(77, 77, 255, 1)"
        {...form.getInputProps("stability")}
      />
    </Stack>
  );
};

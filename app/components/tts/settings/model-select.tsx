import { Group, Select, SelectProps, Stack, Text } from "@mantine/core";
import React, { FC, useEffect } from "react";
import { Model } from "@/app/types/model";
import { useTtsFormContext } from "@/app/context/tts-from";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/app/lib/api/get.models";
import { IconCircleCheckFilled } from "@tabler/icons-react";

interface ModelSelectProps {
  apiKey: string;
}

export const ModelSelect: FC<ModelSelectProps> = ({ apiKey }) => {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["models", apiKey],
    queryFn: () => getModels({ apiKey }),
    enabled: !!apiKey,
  });
  const form = useTtsFormContext();

  useEffect(() => {
    if (data) {
      const elevenMultilingualV2 = data.find(
        (model: Model) => model.model_id === "eleven_multilingual_v2",
      );
      form.setFieldValue(
        "model",
        elevenMultilingualV2?.model_id || data[0]?.model_id,
      );
    }

    if (error) {
      form.setFieldError("model", String(error) || "An unknown error occurred");
    }
  }, [data, error]);

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const model = data?.find((model) => model.model_id === option.value);
    return (
      <Stack gap="8px">
        <Group justify="space-between" align="center" gap="16px">
          <Text>{model?.name}</Text>
          {checked && <IconCircleCheckFilled />}
        </Group>
        <Text c="dimmed" fz="sm">
          {model?.description}
        </Text>
      </Stack>
    );
  };

  return (
    <Select
      color="rgba(77, 77, 255, 1)"
      radius="xl"
      size="md"
      label="Выбор модели"
      description="Доступные модели с описанием"
      data={data?.map((model) => ({
        value: model.model_id,
        label: model.name,
      }))}
      {...form.getInputProps("model")}
      disabled={!isSuccess}
      renderOption={renderSelectOption}
    />
  );
};

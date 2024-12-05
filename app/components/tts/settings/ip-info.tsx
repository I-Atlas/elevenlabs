import { Stack, Text } from "@mantine/core";
import React, { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getIpInfo } from "@/app/lib/api/get.ip-info";

export const IpInfo: FC = () => {
  const { data } = useQuery({
    queryKey: ["ip-info"],
    queryFn: () => getIpInfo(),
  });

  return (
    <Stack gap="8px">
      <Text c="dimmed" size="md">
        IP адрес: {data?.ip}
      </Text>
      <Text c="dimmed" size="md">
        Локация: {data?.country}, {data?.region}, {data?.city}
      </Text>
    </Stack>
  );
};

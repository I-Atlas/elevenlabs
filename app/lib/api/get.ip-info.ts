import { IpInfo } from "@/app/types/ip-info";

export const getIpInfo = async (): Promise<IpInfo> => {
  try {
    const response = await fetch("https://ipinfo.io/json", {
      method: "GET",
    });

    return await response.json();
  } catch (error) {
    const errorMessage =
      (error as Error)?.message || "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

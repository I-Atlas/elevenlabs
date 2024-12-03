import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = request.headers.get("Authorization");
  if (!apiKey) {
    console.error("API key is missing in Authorization header");
    return NextResponse.json(
      { error: "API key is missing in Authorization header" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      const errorMessage =
        errorData.detail?.message || "Failed to retrieve voices";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const voicesData = await response.json();

    return NextResponse.json(voicesData);
  } catch (error) {
    console.error("Error retrieving voices:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

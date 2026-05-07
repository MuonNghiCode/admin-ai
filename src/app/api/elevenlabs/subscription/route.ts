import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  const baseUrl = process.env.ELEVEN_LABS_BASE_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs API Key is not configured on server" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(`${baseUrl}/user/subscription`, {
      headers: {
        "xi-api-key": apiKey,
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("ElevenLabs API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.detail || "Failed to fetch subscription info" },
      { status: error.response?.status || 500 }
    );
  }
}

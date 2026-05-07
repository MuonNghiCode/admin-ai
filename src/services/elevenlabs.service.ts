import axios from "axios";
import type { ElevenLabsSubscription } from "@/types";

class ElevenLabsService {
  private readonly apiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
  private readonly baseUrl = "https://api.elevenlabs.io/v1";

  async getSubscriptionInfo(): Promise<ElevenLabsSubscription> {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API Key is not configured");
    }

    const response = await axios.get<ElevenLabsSubscription>(`${this.baseUrl}/user/subscription`, {
      headers: {
        "xi-api-key": this.apiKey,
        "Accept": "application/json",
      },
    });

    return response.data;
  }
}

export const elevenLabsService = new ElevenLabsService();

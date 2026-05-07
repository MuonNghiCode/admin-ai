import axios from "axios";
import type { ElevenLabsSubscription } from "@/types";

class ElevenLabsService {
  private readonly apiKey = process.env.ELEVEN_LABS_API_KEY;
  private readonly baseUrl = process.env.ELEVEN_LABS_BASE_URL;

  async getSubscriptionInfo(): Promise<ElevenLabsSubscription> {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API Key is not configured");
    }

    const response = await axios.get<ElevenLabsSubscription>(
      `${this.baseUrl}/user/subscription`,
      {
        headers: {
          "xi-api-key": this.apiKey,
          Accept: "application/json",
        },
      },
    );

    return response.data;
  }
}

export const elevenLabsService = new ElevenLabsService();

import axios from "axios";
import type { ElevenLabsSubscription } from "@/types";

class ElevenLabsService {

  async getSubscriptionInfo(): Promise<ElevenLabsSubscription> {
    const response = await axios.get<ElevenLabsSubscription>(
      "/api/elevenlabs/subscription"
    );

    return response.data;
  }
}

export const elevenLabsService = new ElevenLabsService();

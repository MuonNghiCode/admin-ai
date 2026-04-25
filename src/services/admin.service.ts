import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  AdminStatsResponse,
  DeviceResponse,
  DevicesResponse,
  DeviceUpsertRequest,
  IssueDeviceTokenResponse,
  LearningRecommendationResponse,
  SongResponse,
  SongsResponse,
  SongUpsertRequest,
  StoriesResponse,
  StoryResponse,
  StoryUpsertRequest,
  SubscriptionUpdateRequest,
  UserResponse,
  UsersResponse,
  AdminAddBannedWordRequest,
  SafetyResponse,
} from "@/types";

class AdminService extends BaseApiService {
  getStats() {
    return this.get<AdminStatsResponse["value"]>(API_ENDPOINTS.ADMIN.STATS);
  }

  getDevices() {
    return this.get<DevicesResponse["value"]>(API_ENDPOINTS.ADMIN.DEVICES);
  }

  createDevice(payload: DeviceUpsertRequest) {
    return this.post<DeviceResponse["value"]>(API_ENDPOINTS.ADMIN.DEVICES, payload);
  }

  updateDevice(id: string, payload: DeviceUpsertRequest) {
    return this.put<null>(API_ENDPOINTS.ADMIN.DEVICE_BY_ID(id), payload);
  }

  deleteDevice(id: string) {
    return this.delete<null>(API_ENDPOINTS.ADMIN.DEVICE_BY_ID(id));
  }

  issueDeviceToken(deviceId: string) {
    return this.post<IssueDeviceTokenResponse["value"]>(
      API_ENDPOINTS.ADMIN.DEVICE_TOKENS(deviceId),
    );
  }

  revokeDeviceToken(deviceId: string, tokenId: string) {
    return this.delete<null>(
      API_ENDPOINTS.ADMIN.DEVICE_TOKEN_BY_ID(deviceId, tokenId),
    );
  }

  getSongs() {
    return this.get<SongsResponse["value"]>(API_ENDPOINTS.ADMIN.SONGS);
  }

  createSong(payload: SongUpsertRequest) {
    return this.post<SongResponse["value"]>(API_ENDPOINTS.ADMIN.SONGS, payload);
  }

  updateSong(id: string, payload: SongUpsertRequest) {
    return this.put<null>(API_ENDPOINTS.ADMIN.SONG_BY_ID(id), payload);
  }

  deleteSong(id: string) {
    return this.delete<null>(API_ENDPOINTS.ADMIN.SONG_BY_ID(id));
  }

  getStories() {
    return this.get<StoriesResponse["value"]>(API_ENDPOINTS.ADMIN.STORIES);
  }

  createStory(payload: StoryUpsertRequest) {
    return this.post<StoryResponse["value"]>(API_ENDPOINTS.ADMIN.STORIES, payload);
  }

  updateStory(id: string, payload: StoryUpsertRequest) {
    return this.put<null>(API_ENDPOINTS.ADMIN.STORY_BY_ID(id), payload);
  }

  deleteStory(id: string) {
    return this.delete<null>(API_ENDPOINTS.ADMIN.STORY_BY_ID(id));
  }

  getUsers() {
    return this.get<UsersResponse["value"]>(API_ENDPOINTS.ADMIN.USERS);
  }

  getUserById(id: string) {
    return this.get<UserResponse["value"]>(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
  }

  updateUserRole(id: string, roleId: number) {
    return this.put<null>(API_ENDPOINTS.ADMIN.USER_ROLE(id), roleId);
  }

  updateProfileSubscription(id: string, payload: SubscriptionUpdateRequest) {
    return this.put<null>(API_ENDPOINTS.ADMIN.PROFILE_SUBSCRIPTION(id), payload);
  }

  getLearningRecommendation(id: string) {
    return this.get<LearningRecommendationResponse["value"]>(
      API_ENDPOINTS.ADMIN.PROFILE_LEARNING_RECOMMENDATION(id),
    );
  }

  getGlobalSafety() {
    return this.get<SafetyResponse["value"]>(API_ENDPOINTS.ADMIN.SAFETY);
  }

  addGlobalWord(payload: AdminAddBannedWordRequest) {
    return this.post<any>(API_ENDPOINTS.ADMIN.SAFETY, payload);
  }

  deleteGlobalWord(id: number) {
    return this.delete<null>(API_ENDPOINTS.ADMIN.SAFETY_BY_ID(id));
  }

  getDemoVoices() {
    return this.get<any[]>(API_ENDPOINTS.ADMIN.DEMO_VOICES);
  }

  deleteDemoVoice(id: string) {
    return this.delete<any>(API_ENDPOINTS.ADMIN.DEMO_VOICE_BY_ID(id));
  }

  syncMedia() {
    return this.post<any>(API_ENDPOINTS.ADMIN.SYNC, {});
  }

  generateDemo(payload: { text: string; voiceId: string; provider: string }) {
    return this.post<any>(API_ENDPOINTS.ADMIN.GENERATE_DEMO, payload);
  }

  async uploadMedia(file: File, category: string, metadata?: { id?: string; name?: string; displayInfo?: string }) {
    // 1. Request Signed Upload URL (POST)
    const urlRes = await this.post<string>(API_ENDPOINTS.ADMIN.REQUEST_UPLOAD, {
      fileName: file.name,
      category: category,
      id: metadata?.id,
    });
    
    if (urlRes.isFailure) return urlRes;

    let uploadUrl = urlRes.value;
    // Safety check if backend returns { url: "...", message: "...", value: "..." }
    if (typeof uploadUrl === "object" && uploadUrl !== null) {
      uploadUrl = (uploadUrl as any).message || (uploadUrl as any).url || (uploadUrl as any).Value || (uploadUrl as any).value;
    }

    if (!uploadUrl || typeof uploadUrl !== "string") {
      return { isFailure: true, error: { description: "Failed to get a valid upload URL" } } as any;
    }

    // Detect Content-Type from extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    let contentType = "application/octet-stream";
    if (extension === "txt") contentType = "text/plain";
    else if (["mp3", "wav", "m4a", "aac"].includes(extension || "")) contentType = "audio/mpeg";

    // 2. Upload directly to GCS
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        }
      });

      if (!response.ok) {
        return { isFailure: true, error: { description: `Upload to GCS failed with status: ${response.status}` } } as any;
      }

      // 3. Confirm with Backend
      return this.post<any>(API_ENDPOINTS.ADMIN.CONFIRM_UPLOAD, {
        id: metadata?.id,
        fileName: file.name,
        category: category,
        name: metadata?.name,
        displayInfo: metadata?.displayInfo,
      });
    } catch (e) {
      return { isFailure: true, error: { description: `GCS Upload Error: ${e instanceof Error ? e.message : "Unknown"}` } } as any;
    }
  }
}

export const adminService = new AdminService();

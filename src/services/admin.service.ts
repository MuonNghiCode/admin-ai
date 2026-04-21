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
}

export const adminService = new AdminService();

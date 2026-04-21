import type { ApiResponse } from "./responses";

export interface AdminDashboardStats {
  totalUsers: number;
  proUsers: number;
  totalDevices: number;
  activeSessions: number;
  totalRevenueVnd: number;
  totalSongs: number;
  totalStories: number;
  musicStorageMb: number;
  storyStorageKb: number;
  successfulOrdersCount: number;
  lastOrderDate: string | null;
  lastOrderAmount: number;
  lastSyncTime: string;
}

export interface LearningRecommendationData {
  profileId: string;
  childName: string;
  recommendation: string;
  generatedAt: string;
}

export interface SubscriptionUpdateRequest {
  subscriptionPlanId: number;
}

export interface BannedWord {
  id: number;
  word: string;
  category?: string | null;
  isGlobal: boolean;
}

export interface AdminAddBannedWordRequest {
  word: string;
  category?: string;
}

export interface DeviceItem {
  deviceId: string;
  serialNumber: string;
  nickname?: string | null;
  status: string;
  createdAt: string;
  isHardwareProtectionEnabled: boolean;
  profileName?: string | null;
  currentMode?: string | null;
  blockedTopics: string[];
  gender?: string | null;
  personality?: string | null;
  honorific?: string | null;
  age?: number | null;
  profileId?: string | null;
  dailyCandyBalance: number;
  purchasedCandies: number;
  remainingCandiesDisplay: string;
  preferredVoiceId?: string | null;
  preferredTtsProvider?: string | null;
  personalityDescription?: string | null;
  safetyResponseMode: number;
  safetyPretendMessage: string;
  safetyWarningMessage: string;
}

export interface DeviceUpsertRequest {
  deviceId: string;
  serialNumber: string;
  nickname?: string;
  status: string;
  userId?: string | null;
  profileId?: string | null;
  isHardwareProtectionEnabled?: boolean;
}

export interface IssueDeviceTokenData {
  tokenId: string;
  token: string;
  expiresAtUtc: string;
}

export interface SongItem {
  id: string;
  name: string;
  artist: string;
  audioUrl: string;
}

export interface SongUpsertRequest {
  id?: string;
  name: string;
  artist: string;
  audioUrl: string;
  gcsPath?: string;
}

export interface StoryItem {
  id: string;
  name: string;
  contentType: string;
  createdAt: string;
}

export interface StoryUpsertRequest {
  id?: string;
  name: string;
  gcsPath: string;
  contentType: string;
}

export interface UserItem {
  userId: string;
  email: string;
  fullName: string;
  provider?: string | null;
  isPro: boolean;
  smartCandies: number;
  roleId: number;
  createdAt: string;
}

export type AdminStatsResponse = ApiResponse<AdminDashboardStats>;
export type LearningRecommendationResponse = ApiResponse<LearningRecommendationData>;
export type DevicesResponse = ApiResponse<DeviceItem[]>;
export type DeviceResponse = ApiResponse<DeviceItem>;
export type IssueDeviceTokenResponse = ApiResponse<IssueDeviceTokenData>;
export type SongsResponse = ApiResponse<SongItem[]>;
export type SongResponse = ApiResponse<SongItem>;
export type StoriesResponse = ApiResponse<StoryItem[]>;
export type StoryResponse = ApiResponse<StoryItem>;
export type UsersResponse = ApiResponse<UserItem[]>;
export type UserResponse = ApiResponse<UserItem>;
export type SafetyResponse = ApiResponse<BannedWord[]>;

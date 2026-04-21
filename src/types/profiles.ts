import type { ApiResponse } from "./responses";

export interface ProfileSummary {
  id: string;
  name: string;
  age: number;
  gender: string;
  currentMode: string;
  subscriptionEndUtc: string | null;
  subscriptionStatus: number;
  dailyCandyBalance: number;
}

export interface ProfileSubscriptionPlan {
  id: number;
  planType: number;
  name: string;
  description: string;
  canPlayMusic: boolean;
  canTellStoriesOnUserSpeech: boolean;
  canUseLearningAI: boolean;
  priceMonthly: number;
  isActive: boolean;
  dailyCandyLimit: number;
}

export interface ProfileUpsertRequest {
  id: string;
  name: string;
  age: number;
  subscriptionPlanId: number;
  subscriptionPlan: ProfileSubscriptionPlan;
  subscribedSubjects: string[];
  subscriptionStatus: number;
  subscriptionStartUtc: string;
  subscriptionEndUtc: string;
  graceEndUtc: string;
  allowedStartHour: number;
  allowedEndHour: number;
  blockedTopics: string[];
  whitelistTopics: string[];
  bannedKeywords: string[];
  currentMode: string;
  bearCategory: number;
  gender: string;
  honorific: string;
  personality: string;
  personalityDescription: string;
  preferredVoiceId: string;
  preferredTtsProvider: string;
  safetyResponseMode: number;
  safetyPretendMessage: string;
  safetyWarningMessage: string;
  dailyCandyBalance: number;
  lastQuotaResetUtc: string;
}

export type ProfileDetail = ProfileSummary;

export type ProfileListResponse = ApiResponse<ProfileSummary[]>;
export type ProfileDetailResponse = ApiResponse<ProfileDetail>;
export type ProfileMutationResponse = ApiResponse<ProfileSummary>;

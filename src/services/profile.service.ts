import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  LearningRecommendationResponse,
  ProfileDetailResponse,
  ProfileListResponse,
  ProfileMutationResponse,
  ProfileUpsertRequest,
  SubscriptionUpdateRequest,
} from "@/types";

class ProfileService extends BaseApiService {
  getAll() {
    return this.get<ProfileListResponse["value"]>(API_ENDPOINTS.ADMIN.PROFILES);
  }

  getById(id: string) {
    return this.get<ProfileDetailResponse["value"]>(
      API_ENDPOINTS.ADMIN.PROFILE_BY_ID(id),
    );
  }

  create(payload: ProfileUpsertRequest) {
    return this.post<ProfileMutationResponse["value"]>(
      API_ENDPOINTS.ADMIN.PROFILES,
      payload,
    );
  }

  update(id: string, payload: ProfileUpsertRequest) {
    return this.put<ProfileMutationResponse["value"]>(
      API_ENDPOINTS.ADMIN.PROFILE_BY_ID(id),
      payload,
    );
  }

  remove(id: string) {
    return this.delete<null>(API_ENDPOINTS.ADMIN.PROFILE_BY_ID(id));
  }

  updateSubscription(id: string, payload: SubscriptionUpdateRequest) {
    return this.put<null>(API_ENDPOINTS.ADMIN.PROFILE_SUBSCRIPTION(id), payload);
  }

  getLearningRecommendation(id: string) {
    return this.get<LearningRecommendationResponse["value"]>(
      API_ENDPOINTS.ADMIN.PROFILE_LEARNING_RECOMMENDATION(id),
    );
  }
}

export const profileService = new ProfileService();

export const API_BASE_URL =
  typeof window !== "undefined"
    ? ""
    : (typeof process !== "undefined" && process.env.BACKEND_API_BASE_URL) ||
      "http://localhost:7017";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/Auth/login",
    LOGOUT: "/api/Auth/logout",
    PROFILE: "/api/Auth/profile",
    GET_PROFILE: "/api/Users/{userId}/profile",
    SIGNUP: "/api/Auth/signup",
    VERIFY_EMAIL: "/api/Auth/verify-email",
    GOOGLE_LOGIN: "/api/Auth/google-login",
    GOOGLE_COMPLETE_PROFILE: "/api/Auth/google-complete-profile",
  },
  ADMIN: {
    STATS: "/api/Admin/stats",
    PROFILES: "/api/Admin/profiles",
    PROFILE_BY_ID: (id: string) => `/api/Admin/profiles/${id}`,
    PROFILE_SUBSCRIPTION: (id: string) =>
      `/api/Admin/profiles/${id}/subscription`,
    PROFILE_LEARNING_RECOMMENDATION: (id: string) =>
      `/api/Admin/profiles/${id}/learning-recommendation`,
    DEVICES: "/api/Admin/devices",
    DEVICE_BY_ID: (id: string) => `/api/Admin/devices/${id}`,
    DEVICE_TOKENS: (id: string) => `/api/Admin/devices/${id}/tokens`,
    DEVICE_TOKEN_BY_ID: (deviceId: string, tokenId: string) =>
      `/api/Admin/devices/${deviceId}/tokens/${tokenId}`,
    SONGS: "/api/Admin/songs",
    SONG_BY_ID: (id: string) => `/api/Admin/songs/${id}`,
    STORIES: "/api/Admin/stories",
    STORY_BY_ID: (id: string) => `/api/Admin/stories/${id}`,
    VOICES: "/api/Admin/voices",
    VOICE_BY_ID: (id: string) => `/api/Admin/voices/${id}`,
    USERS: "/api/Admin/users",
    USER_BY_ID: (id: string) => `/api/Admin/users/${id}`,
    USER_ROLE: (id: string) => `/api/Admin/users/${id}/role`,
    SAFETY: "/api/Admin/safety",
    SAFETY_BY_ID: (id: number) => `/api/Admin/safety/${id}`,
    SYNC: "/api/Admin/sync",
    GENERATE_DEMO: "/api/Admin/generate-demo",
    UPLOAD_MEDIA: "/api/Admin/media/upload",
    REQUEST_UPLOAD: "/api/Admin/request-upload",
    CONFIRM_UPLOAD: "/api/Admin/confirm-upload",
  },
} as const;

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
} as const;

export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Không thể kết nối tới máy chủ",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn",
  FORBIDDEN: "Bạn không có quyền truy cập",
  NOT_FOUND: "Không tìm thấy tài nguyên",
  SERVER_ERROR: "Lỗi máy chủ nội bộ",
  VALIDATION_ERROR: "Dữ liệu nhập không hợp lệ",
} as const;

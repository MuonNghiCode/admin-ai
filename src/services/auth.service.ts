import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  AuthTokenResponseData,
  GoogleCompleteProfileRequest,
  GoogleLoginResponseData,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from "@/types";

class AuthService extends BaseApiService {
  signin(credentials: LoginRequest) {
    return this.post<AuthTokenResponseData>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  signup(payload: RegisterRequest) {
    return this.post<AuthTokenResponseData>(API_ENDPOINTS.AUTH.SIGNUP, payload);
  }

  verifyEmail(payload: VerifyEmailRequest) {
    return this.post<AuthTokenResponseData>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
  }

  googleLogin(payload: GoogleLoginRequest) {
    return this.post<GoogleLoginResponseData>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, payload);
  }

  googleCompleteProfile(payload: GoogleCompleteProfileRequest) {
    return this.post<AuthTokenResponseData>(
      API_ENDPOINTS.AUTH.GOOGLE_COMPLETE_PROFILE,
      payload,
    );
  }
}

export const authService = new AuthService();
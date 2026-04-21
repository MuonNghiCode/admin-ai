export interface ApiResponseError {
	code: string;
	description: string;
}

export interface ApiResponse<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    description: string;
  };
}

export interface AuthTokenResponseData {
	success?: boolean;
	token?: string;
	refreshToken?: string;
	errorMessage?: string | null;
	userId?: string;
	roleId?: number;
}

export interface GoogleLoginResponseData {
	token?: string;
	registrationToken?: string;
	email?: string;
	fullName?: string;
	phoneNumber?: string;
	dateOfBirth?: string;
	gender?: "M" | "F";
}

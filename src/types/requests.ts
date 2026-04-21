export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	fullName: string;
	phoneNumber?: string;
}

export interface VerifyEmailRequest {
	email: string;
	otp: string;
}

export interface GoogleLoginRequest {
	credential: string;
}

export interface GoogleCompleteProfileRequest {
	registrationToken: string;
	fullName: string;
	phoneNumber?: string;
	dateOfBirth?: string;
	gender?: "M" | "F";
}

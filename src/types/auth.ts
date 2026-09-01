import type { ReactNode, ChangeEvent, FormEvent } from "react";
import type { BETTER_AUTH_ERROR_CODES } from "@/constants/auth";

/** Union of all 18 official Better Auth redirect error codes */
export type BetterAuthErrorCode = (typeof BETTER_AUTH_ERROR_CODES)[number];

/** Form payload for user sign in */
export interface SignInFormData {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

/** Form payload for user sign up */
export interface SignUpFormData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}

/** Form payload for email verification code */
export interface VerifyEmailFormData {
  code: string;
}

/** Form payload for mandatory password creation onboarding */
export interface CreatePasswordFormData {
  password: string;
  confirmPassword: string;
}

/** Form payload for requesting password reset */
export interface ForgotPasswordFormData {
  email: string;
}

/** Component props for AuthCardWrapper */
export interface AuthCardWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  showGoogleAuth?: boolean;
  onGoogleAuth?: () => void;
  isLoading?: boolean;
}

/** Component props for SignInForm */
export interface SignInFormProps {
  isLoading?: boolean;
}

/** Component props for SignUpForm */
export interface SignUpFormProps {
  isLoading?: boolean;
}

/** Component props for VerifyEmailView */
export interface VerifyEmailViewProps {
  isLoading?: boolean;
  userEmail?: string;
}

/** Component props for CreatePasswordForm */
export interface CreatePasswordFormProps {
  isLoading?: boolean;
}

/** Component props for ForgotPasswordForm */
export interface ForgotPasswordFormProps {
  isLoading?: boolean;
}

/** Return interface for useSignInForm hook */
export interface UseSignInFormReturn {
  formData: SignInFormData;
  isSubmitting: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
}

/** Return interface for useSignUpForm hook */
export interface UseSignUpFormReturn {
  formData: SignUpFormData;
  isSubmitting: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
}

/** Return interface for useAuthError hook */
export interface UseAuthErrorReturn {
  errorCode: string | null;
  errorMessage: string | null;
  handleAuthError: (error: unknown) => void;
}


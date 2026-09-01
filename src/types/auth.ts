import type { ReactNode } from "react";

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

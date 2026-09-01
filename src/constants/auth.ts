/** Static copy and messages for authentication screens */
export const AUTH_MESSAGES = {
  signInTitle: "Welcome Back",
  signInSubtitle: "Sign in to access your Quran Edge API developer account and manage keys.",
  signUpTitle: "Create Account",
  signUpSubtitle: "Get started with free Quran Edge API credentials and generous daily rate limits.",
  verifyEmailTitle: "Verify Your Email",
  verifyEmailSubtitle: "We sent a 6-digit verification code to your email address. Enter it below to activate your account.",
  createPasswordTitle: "Set Your Password",
  createPasswordSubtitle: "To complete your Google onboarding and enable multi-login, please set a password for your account.",
  forgotPasswordTitle: "Reset Password",
  forgotPasswordSubtitle: "Enter your registered email address and we'll send you a password reset link.",
};


/**
 * All 18 official Better Auth redirect error codes as documented in
 * https://better-auth.com/docs/reference/errors
 */
export const BETTER_AUTH_ERROR_CODES = [
  "invalid_callback_request",
  "invalid_code",
  "internal_server_error",
  "state_not_found",
  "state_invalid",
  "state_mismatch",
  "no_code",
  "no_callback_url",
  "oauth_provider_not_found",
  "email_not_found",
  "email_doesnt_match",
  "unable_to_get_user_info",
  "unable_to_link_account",
  "unable_to_create_user",
  "unable_to_create_session",
  "account_not_linked",
  "account_already_linked_to_different_user",
  "signup_disabled",
] as const;

/**
 * User-friendly error messages for all official Better Auth error codes.
 * Displayed via Sonner toast when redirected to /auth/signin?error=<code_resmi>.
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_callback_request:
    "Invalid callback request. The authentication request could not be processed.",
  invalid_code:
    "The verification code provided is invalid or has expired.",
  internal_server_error:
    "An internal server error occurred during authentication. Please try again later.",
  state_not_found:
    "Authentication session state was not found. Please try signing in again.",
  state_invalid:
    "Authentication session state is invalid. Please restart the sign-in process.",
  state_mismatch:
    "Security validation failed (state mismatch). Please try signing in again.",
  no_code:
    "No authorization code was returned from the authentication provider.",
  no_callback_url:
    "No valid callback URL was specified for authentication.",
  oauth_provider_not_found:
    "The requested OAuth authentication provider is not configured.",
  email_not_found:
    "No account associated with this email address was found.",
  email_doesnt_match:
    "The email address returned by the provider does not match the expected email.",
  unable_to_get_user_info:
    "Failed to retrieve user profile information from the authentication provider.",
  unable_to_link_account:
    "Unable to link this social account to your existing user account.",
  unable_to_create_user:
    "Failed to create a new user account. Please try again.",
  unable_to_create_session:
    "Failed to create an active login session. Please try signing in again.",
  account_not_linked:
    "An account with this email already exists but is not linked to Google. Please sign in with your email and password, then connect Google from Account Settings.",
  account_already_linked_to_different_user:
    "This social account is already linked to a different user account.",
  signup_disabled:
    "New account registration is currently disabled.",
};

/** Session cookie name constant */
export const SESSION_COOKIE_NAME = "quran_api.session_token";

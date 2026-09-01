import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client-side React Instance.
 * Provides reactive hooks: useSession(), signIn, signUp, signOut, linkSocial.
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

export const { useSession, signIn, signUp, signOut, linkSocial, unlinkAccount } =
  authClient;

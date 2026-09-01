/**
 * API Key status definition
 */
export type ApiKeyStatus = "active" | "revoked" | "expired";

/**
 * API Key item definition for database and API responses
 */
export interface ApiKeyRecord {
  id: string;
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  status: ApiKeyStatus;
  rateLimit: number;
  lastUsedAt?: string | null;
  createdAt: string;
}

/**
 * Payload required to generate a new API key
 */
export interface CreateApiKeyPayload {
  name: string;
}

/**
 * Response returned upon successful API key creation (contains rawKey once)
 */
export interface CreateApiKeyResponse {
  id: string;
  name: string;
  rawKey: string;
  keyPrefix: string;
  keyMasked: string;
  rateLimit: number;
  createdAt: string;
}

/**
 * API key verification result structure
 */
export interface ApiKeyValidationResult {
  valid: boolean;
  apiKey?: ApiKeyRecord | null;
  error?: string | null;
}

/**
 * @file useAuth.hook.ts
 * @module frontend/src/hooks
 * @description Instructions for Authentication State Custom Hook.
 *
 * PURPOSE:
 * Manage authentication state: login, logout, token refresh, and current user identity.
 *
 * STATE:
 * - user: AuthUser | null  (contains id, email, role)
 * - isAuthenticated: boolean
 * - isLoading: boolean
 *
 * FUNCTIONS:
 * - login(email: string, password: string): Promise<void>
 *   → POST /api/v1/auth/login → store access token in memory, refresh token in HttpOnly cookie.
 * - logout(): void
 *   → POST /api/v1/auth/logout → clear tokens.
 * - refreshToken(): Promise<boolean>
 *   → POST /api/v1/auth/refresh → renew access token silently before expiry.
 * - hasRole(role: Role): boolean
 *   → Compare current user's role for UI conditional rendering.
 *
 * KEY CONSTRAINTS:
 * - Access token stored in memory only (never localStorage for XSS protection).
 * - Refresh token stored in HttpOnly cookie.
 * - Silently refresh token on 401 response using axios interceptor.
 * - Redirect to /login on auth failure.
 */

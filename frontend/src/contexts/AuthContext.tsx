/**
 * @file AuthContext.tsx
 * @module frontend/src/contexts
 * @description Instructions for Authentication React Context Provider.
 *
 * PURPOSE:
 * Provide authentication state globally across the app tree without prop drilling.
 *
 * CONTEXT VALUE (AuthContextType):
 * - user: AuthUser | null
 * - isAuthenticated: boolean
 * - isLoading: boolean
 * - login(email, password): Promise<void>
 * - logout(): void
 * - hasRole(role): boolean
 *
 * IMPLEMENTATION NOTES:
 * - Wrap the entire App in <AuthProvider> at the root.
 * - On mount: attempt silent token refresh to restore session.
 * - Export useAuthContext() hook for consuming the context.
 * - Protect routes with <PrivateRoute requiredRole="TRAVELER"> component.
 */

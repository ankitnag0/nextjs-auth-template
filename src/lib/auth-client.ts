/**
 * Better Auth Client Configuration
 * 
 * This is the client-side auth instance used in React components.
 * It provides methods for authentication from the browser:
 * - authClient.signIn.email()
 * - authClient.signUp.email()
 * - authClient.signOut()
 * - authClient.useSession() (React hook)
 * 
 * All methods make requests to /api/auth/* endpoints
 */

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // Base URL for API requests
    // In production, this can be omitted (defaults to current domain)
    baseURL: "http://localhost:3000"
})

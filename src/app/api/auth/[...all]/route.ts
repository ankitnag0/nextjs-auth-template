/**
 * Better Auth API Route Handler
 * 
 * This catch-all route handles ALL authentication endpoints:
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-out
 * - GET /api/auth/get-session
 * - And more...
 * 
 * Better Auth automatically creates these endpoints based on your config.
 * The [...all] pattern catches all sub-routes under /api/auth/
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export POST and GET handlers for Next.js App Router
export const { POST, GET } = toNextJsHandler(auth);

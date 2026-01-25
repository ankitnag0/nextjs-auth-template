/**
 * Better Auth Server Configuration
 * 
 * This is the main auth instance used on the server-side.
 * It handles all authentication logic, session management, and database operations.
 * 
 * Key concepts:
 * - emailAndPassword: Enables email/password authentication
 * - drizzleAdapter: Connects Better Auth to your Drizzle database
 * - nextCookies: Plugin for Next.js cookie handling (HTTP-only, secure)
 * - Database tables: user, session, account, verification
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema/auth-schema";

export const auth = betterAuth({
    // Base URL for OAuth callbacks (required for Google OAuth)
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    
    // Enable email and password authentication
    emailAndPassword: { 
      enabled: true, 
    },
    
    // Social providers configuration
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    
    // Connect to database using Drizzle ORM adapter
    database: drizzleAdapter(db, {
        provider: "sqlite", // Using SQLite (can be changed to Turso)
        schema: {
            user,           // User accounts table
            session,        // Active sessions table
            account,        // OAuth accounts (Google, etc.)
            verification,   // Email verification tokens
        },
    }),
    // Plugins
    plugins: [
        // Admin plugin for user management
        admin({
            defaultRole: "user",
            adminUserIds: process.env.ADMIN_USER_IDS?.split(",") || [],
        }),
        // Next.js cookie plugin for secure session management
        nextCookies()
    ] 
});

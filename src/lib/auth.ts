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
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema/auth-schema";

export const auth = betterAuth({
    // Enable email and password authentication
    emailAndPassword: { 
      enabled: true, 
    }, 
    // Connect to database using Drizzle ORM adapter
    database: drizzleAdapter(db, {
        provider: "sqlite", // Using SQLite (can be changed to Turso)
        schema: {
            user,           // User accounts table
            session,        // Active sessions table
            account,        // OAuth accounts (for future Google auth)
            verification,   // Email verification tokens
        },
    }),
    // Next.js cookie plugin for secure session management
    plugins: [nextCookies()] 
});

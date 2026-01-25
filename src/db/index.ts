/**
 * Drizzle Database Client
 * 
 * Creates a connection to the SQLite database using libsql driver.
 * 
 * Configuration:
 * - Uses local SQLite file (specified in drizzle.config.ts)
 * - Can be switched to Turso for production (cloud SQLite)
 * - Type-safe queries with Drizzle ORM
 * 
 * This instance is imported by Better Auth to store:
 * - User accounts
 * - Active sessions
 * - OAuth accounts
 * - Verification tokens
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

// Initialize Drizzle with SQLite database
export const db = drizzle(process.env.DB_FILE_NAME!);

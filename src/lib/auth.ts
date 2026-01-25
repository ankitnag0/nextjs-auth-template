import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema/auth-schema";

export const auth = betterAuth({
    emailAndPassword: { 
      enabled: true, 
    }, 
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    plugins: [nextCookies()] 
});

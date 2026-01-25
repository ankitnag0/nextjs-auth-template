/**
 * Admin Check Helper
 * 
 * Utility functions to verify if a user has admin privileges.
 * Used in admin pages for server-side protection.
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Check if current user is an admin
 * Returns session if admin, redirects to home if not
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not authenticated - redirect to signin
  if (!session) {
    redirect("/signin");
  }

  // Check if user is admin
  const isAdmin = session.user.role === "admin" || 
                  process.env.ADMIN_USER_IDS?.split(",").includes(session.user.id);

  // Not admin - redirect to home
  if (!isAdmin) {
    redirect("/");
  }

  return session;
}

/**
 * Check if a user ID is an admin (without session)
 */
export function isUserAdmin(userId: string, userRole?: string): boolean {
  return userRole === "admin" || 
         process.env.ADMIN_USER_IDS?.split(",").includes(userId) || false;
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LogoutButton } from "@/components/logout-button";
import { isUserAdmin } from "@/lib/admin-check";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Protected Dashboard Page
 * 
 * This page demonstrates:
 * - Server-side session validation using Better Auth
 * - Redirecting unauthenticated users to signin
 * - Displaying user information from the session
 * - Logout functionality
 */
export default async function DashboardPage() {
  // Server-side session check using Better Auth API
  // This runs on every request to ensure user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If no session exists, redirect to signin page
  // This is server-side protection - user never sees this page without auth
  if (!session) {
    redirect("/signin");
  }

  // Check if user is admin
  const isAdmin = isUserAdmin(session.user.id, session.user.role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome, {session.user.name || "User"}! 👋
          </h1>
          <p className="text-muted-foreground">
            You're now authenticated and viewing a protected page
          </p>
          {isAdmin && (
            <div className="flex justify-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Admin User
              </span>
            </div>
          )}
        </div>

        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Session Information</CardTitle>
            <CardDescription>
              Data retrieved from Better Auth session (server-side)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{session.user.id}</p>
            </div>
            
            {session.user.name && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm">{session.user.name}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{session.user.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email Verified</p>
              <p className="text-sm">{session.user.emailVerified ? "Yes" : "No"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Session ID</p>
              <p className="font-mono text-sm">{session.session.id}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Session Expires</p>
              <p className="text-sm">
                {new Date(session.session.expiresAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works Card */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base">🔍 How This Works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Server Component:</strong> This page is a React Server Component that runs on the server
            </p>
            <p>
              <strong>Session Check:</strong> We call <code className="bg-muted px-1 py-0.5 rounded">auth.api.getSession()</code> to validate your session
            </p>
            <p>
              <strong>Protected Route:</strong> If no session exists, you're automatically redirected to <code className="bg-muted px-1 py-0.5 rounded">/signin</code>
            </p>
            <p>
              <strong>Database:</strong> Session data is stored in SQLite using Drizzle ORM
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          {isAdmin && (
            <Button asChild variant="outline">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

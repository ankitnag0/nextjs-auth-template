import { requireAdmin } from "@/lib/admin-check";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Admin Dashboard
 * 
 * Protected route - only accessible to admin users.
 * Shows admin overview and links to management pages.
 */
export default async function AdminPage() {
  // Verify admin status - redirects if not admin
  const session = await requireAdmin();

  // Get total users count
  const users = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 1 },
  });

  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and view system information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Role</CardTitle>
              <CardDescription>Current admin status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">
                {session.user.role || "Admin"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin ID</CardTitle>
              <CardDescription>Your user identifier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="truncate font-mono text-sm">
                {session.user.id}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View, edit, ban, and manage all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Back to App</CardTitle>
              <CardDescription>
                Return to the main dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base">🔍 How Admin Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Admin Plugin:</strong> Powered by Better Auth admin plugin
            </p>
            <p>
              <strong>Access Control:</strong> User role = "admin" or ID in ADMIN_USER_IDS env var
            </p>
            <p>
              <strong>Protection:</strong> Proxy + server-side validation on every admin page
            </p>
            <p>
              <strong>Features:</strong> User CRUD, ban/unban, role management, session control
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

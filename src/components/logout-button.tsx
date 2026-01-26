"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

/**
 * Logout Button Component
 * 
 * Client component that handles user sign out:
 * - Calls Better Auth signOut method
 * - Clears session cookie and database record
 * - Redirects to signin page
 */
export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    // Call Better Auth to clear session
    // This removes the session from database and clears the cookie
    await authClient.signOut()
    toast.success("Logged out successfully")
    router.push("/signin")
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  )
}

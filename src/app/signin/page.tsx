import { LoginForm } from "@/components/login-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Sign In Page
 * 
 * Public route for user authentication.
 * Redirects to dashboard if already logged in.
 */
export default async function SignInPage() {
  // Check if user is already authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Redirect to dashboard if already logged in
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

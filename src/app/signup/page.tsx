import { SignupForm } from "@/components/signup-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Sign Up Page
 * 
 * Public route for new user registration.
 * Redirects to dashboard if already logged in.
 */
export default async function SignUpPage() {
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
        <SignupForm />
      </div>
    </div>
  )
}

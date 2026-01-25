"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Signup Form Component
 * 
 * Client component that handles user registration:
 * - Uses Better Auth client SDK (authClient.signUp.email)
 * - Creates user in database via /api/auth/sign-up/email
 * - Automatically signs in user after successful registration
 * - Redirects to /dashboard on success
 */
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    // Call Better Auth client SDK
    // This creates a new user and automatically signs them in
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    })

    if (error) {
      setError(error.message || "Sign up failed")
    } else {
      // Redirect to protected dashboard after successful signup
      router.push("/dashboard")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput id="password" name="password" required />
              </Field>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Field>
                <Button type="submit">Sign up</Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => authClient.signIn.social({ 
                    provider: "google",
                    callbackURL: "/dashboard"
                  })}
                >
                  Sign up with Google
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/signin">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

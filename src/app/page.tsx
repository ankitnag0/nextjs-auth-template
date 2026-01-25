import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Next.js Auth Template
          </h1>
          <p className="text-xl text-muted-foreground">
            Production-ready authentication starter with Better Auth, Drizzle ORM, and shadcn/ui
          </p>
        </div>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
            <CardDescription>
              Everything you need to get started with authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-medium">Email/Password Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Secure user sign up and sign in with Better Auth
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗄️</span>
              <div>
                <p className="font-medium">Database with Drizzle ORM</p>
                <p className="text-sm text-muted-foreground">
                  Type-safe database access with SQLite/Turso support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-medium">Beautiful UI Components</p>
                <p className="text-sm text-muted-foreground">
                  Pre-built forms and components with shadcn/ui
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-medium">Protected Routes</p>
                <p className="text-sm text-muted-foreground">
                  Server-side session validation and route protection
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Try It Now - Sign Up</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Create an account to see the authenticated dashboard
          </p>
        </div>

        {/* Tech Stack */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              Built with Next.js 16, TypeScript, Tailwind CSS v4, and Bun
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

# Using This Template

Complete guide to using the Next.js Auth Template in your projects.

## Table of Contents

- [Quick Start](#quick-start)
- [Understanding the Architecture](#understanding-the-architecture)
- [Authentication Features](#authentication-features)
- [Customization Guide](#customization-guide)
- [Common Tasks](#common-tasks)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Clone or Use Template

```bash
# Option A: Clone directly
git clone <your-repo-url> my-app
cd my-app

# Option B: Use as GitHub template
# Click "Use this template" on GitHub
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Database

```bash
# Push database schema
bun db:push

# Optional: Open database GUI
bun db:studio
```

### 4. Run Development Server

```bash
bun dev
```

Visit `http://localhost:3000` - you'll see the landing page!

### 5. Test Authentication

1. Click "Try It Now - Sign Up"
2. Create an account with email/password
3. You'll be redirected to `/dashboard`
4. See your session information
5. Click logout to return to `/signin`

---

## Understanding the Architecture

### Authentication Flow

#### Email/Password Sign Up

```
User fills form → Client calls authClient.signUp.email()
                    ↓
                POST /api/auth/sign-up/email
                    ↓
                Better Auth creates user in database
                    ↓
                Session created, cookie set
                    ↓
                Redirect to /dashboard
```

#### Email/Password Sign In

```
User fills form → Client calls authClient.signIn.email()
                    ↓
                POST /api/auth/sign-in/email
                    ↓
                Better Auth validates credentials
                    ↓
                Session created, cookie set
                    ↓
                Redirect to /dashboard
```

#### Google OAuth

```
User clicks button → authClient.signIn.social({ provider: "google" })
                       ↓
                   Redirect to Google OAuth
                       ↓
                   User authorizes
                       ↓
                   Google redirects to /api/auth/callback/google
                       ↓
                   Better Auth creates/updates user
                       ↓
                   Session created, cookie set
                       ↓
                   Redirect to /dashboard
```

### Route Protection

**Two-Layer Security System:**

#### 1. Proxy Layer (Fast, Optimistic)

**File:** `src/proxy.ts`

```typescript
// Checks if session cookie EXISTS (doesn't validate)
const sessionCookie = getSessionCookie(request);
if (!sessionCookie) {
  // Instant redirect - no database call
  return NextResponse.redirect(new URL("/signin", request.url));
}
```

**Pros:**
- ⚡ Very fast (no database query)
- 🎨 Better UX (no page flash)

**Cons:**
- ⚠️ NOT secure alone (cookie could be faked)

#### 2. Page Validation (Secure)

**File:** `src/app/dashboard/page.tsx`

```typescript
// Validates session in database
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  // Real security check - validates token
  redirect("/signin");
}
```

**Pros:**
- 🔒 Fully secure (validates against database)
- ✅ Cannot be bypassed

**Cons:**
- 🐌 Slower (database query on every request)

**Together:** Fast UX + Real Security ✨

### File Structure Explained

```
src/
├── app/
│   ├── api/auth/[...all]/     # Better Auth API endpoints
│   │   └── route.ts            # Handles all /api/auth/* requests
│   ├── dashboard/              # Protected route example
│   │   └── page.tsx            # Shows user info, requires auth
│   ├── signin/                 # Public sign in page
│   │   └── page.tsx            # Redirects if already logged in
│   ├── signup/                 # Public sign up page
│   │   └── page.tsx            # Redirects if already logged in
│   ├── page.tsx                # Public landing page
│   └── layout.tsx              # Root layout with metadata
│
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── login-form.tsx          # Login form with email + Google
│   ├── signup-form.tsx         # Signup form with email + Google
│   ├── logout-button.tsx       # Client-side logout button
│   └── password-input.tsx      # Input with show/hide toggle
│
├── db/
│   ├── schema/
│   │   ├── auth-schema.ts      # Database tables for auth
│   │   └── index.ts            # Export all schemas
│   └── index.ts                # Drizzle database client
│
├── lib/
│   ├── auth.ts                 # Better Auth server config
│   ├── auth-client.ts          # Better Auth client config
│   └── utils.ts                # Utility functions
│
└── proxy.ts                    # Next.js 16 proxy for route protection
```

---

## Authentication Features

### Email/Password Authentication

**Sign Up:**
- User provides: name, email, password
- Password is hashed with bcrypt
- User created in database
- Session automatically created
- Redirect to dashboard

**Sign In:**
- User provides: email, password
- Password validated against hash
- Session created
- Redirect to dashboard

**Logout:**
- Session deleted from database
- Cookie cleared
- Redirect to signin page

### Google OAuth

**What Happens:**
1. User clicks "Login with Google"
2. Redirects to Google consent screen
3. User authorizes your app
4. Google redirects back with authorization code
5. Better Auth exchanges code for user info
6. User created/updated in database
7. Session created
8. Redirect to dashboard

**Required Setup:**
- Google OAuth credentials (see README)
- Environment variables configured
- Redirect URI whitelisted in Google Console

### Session Management

**How Sessions Work:**

1. **Session Creation:**
   - When user signs in/up
   - Random token generated
   - Stored in database with expiry
   - Sent to browser as HTTP-only cookie

2. **Session Validation:**
   - Cookie sent with every request
   - Server looks up token in database
   - Returns user info if valid
   - Returns null if expired/invalid

3. **Session Expiry:**
   - Default: 7 days
   - Automatically cleaned up
   - User must sign in again after expiry

**Cookie Details:**
- HTTP-only (JavaScript can't access)
- Secure (HTTPS only in production)
- SameSite=Lax (CSRF protection)

---

## Customization Guide

### Add a New Protected Page

```typescript
// src/app/settings/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return <div>Settings for {session.user.name}</div>;
}
```

**Add to proxy protection:**

```typescript
// src/proxy.ts
export const config = {
  matcher: ["/dashboard", "/settings"], // Add your route
};
```

### Add More OAuth Providers

**Example: GitHub**

1. Get credentials from GitHub OAuth Apps
2. Update `src/lib/auth.ts`:

```typescript
socialProviders: {
  google: { /* ... */ },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  },
},
```

3. Add to `.env`:

```env
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
```

4. Add button to forms:

```tsx
<Button onClick={() => authClient.signIn.social({ 
  provider: "github",
  callbackURL: "/dashboard"
})}>
  Sign in with GitHub
</Button>
```

### Customize Session Duration

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days (in seconds)
  },
  // ... rest of config
});
```

### Add User Roles/Permissions

1. **Add role to schema:**

```typescript
// src/db/schema/auth-schema.ts
export const user = sqliteTable("user", {
  // ... existing fields
  role: text("role").default("user"), // Add this
});
```

2. **Push schema:**

```bash
bun db:generate
bun db:push
```

3. **Check role in page:**

```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (session?.user.role !== "admin") {
  redirect("/");
}
```

### Switch to Turso (Production Database)

1. **Install Turso CLI:**

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. **Create database:**

```bash
turso db create my-app-db
turso db show my-app-db
```

3. **Update `.env`:**

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token
```

4. **Update `drizzle.config.ts`:**

```typescript
export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  // ... rest
});
```

5. **Push schema:**

```bash
bun db:push
```

---

## Common Tasks

### Get Current User in Any Component

**Server Component:**

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function MyComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return <div>Not logged in</div>;

  return <div>Hello {session.user.name}</div>;
}
```

**Client Component:**

```typescript
"use client"
import { authClient } from "@/lib/auth-client";

export function MyComponent() {
  const { data: session } = authClient.useSession();

  if (!session) return <div>Not logged in</div>;

  return <div>Hello {session.user.name}</div>;
}
```

### Require Email Verification

**1. Enable in config:**

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Add this
  },
  // ...
});
```

**2. Add email sender:**

Better Auth needs an email sender. Example with Resend:

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Send email with verification link
      await resend.emails.send({
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Verify Email</a>`,
      });
    },
  },
  // ...
});
```

### Password Reset Flow

Better Auth has built-in password reset. To enable:

1. **Add to config:**

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // Send email with reset link
    },
  },
});
```

2. **Create reset page:**

```typescript
// src/app/reset-password/page.tsx
"use client"
import { authClient } from "@/lib/auth-client";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authClient.forgetPassword({ email });
    // Show success message
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button>Send Reset Link</button>
    </form>
  );
}
```

### Add Profile Picture

1. **Add to schema:**

```typescript
export const user = sqliteTable("user", {
  // ... existing fields
  image: text("image"), // Already exists for OAuth
});
```

2. **Upload image** (use any storage: S3, Cloudinary, etc.)

3. **Update user:**

```typescript
await auth.api.updateUser({
  userId: session.user.id,
  image: "https://example.com/profile.jpg",
});
```

4. **Display:**

```tsx
<img src={session.user.image} alt={session.user.name} />
```

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repo

3. **Add Environment Variables:**
   ```
   BETTER_AUTH_URL=https://yourdomain.vercel.app
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   TURSO_DATABASE_URL=your_turso_url
   TURSO_AUTH_TOKEN=your_turso_token
   ```

4. **Update Google OAuth:**
   - Add redirect URI: `https://yourdomain.vercel.app/api/auth/callback/google`

5. **Deploy!**

### Other Platforms

**Railway, Fly.io, Netlify:**
- Similar process
- Set environment variables
- Update redirect URIs
- Deploy

**Self-Hosted:**
- Build: `bun run build`
- Start: `bun start`
- Use PM2 or similar for process management
- Set up reverse proxy (nginx/caddy)

---

## Troubleshooting

### "redirect_uri_mismatch" (Google OAuth)

**Cause:** Redirect URI doesn't match Google Console

**Fix:**
1. Check your `BETTER_AUTH_URL` in `.env`
2. Ensure redirect URI in Google Console matches exactly:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://yourdomain.com/api/auth/callback/google`
3. Restart dev server after changing `.env`

### Session Not Persisting

**Cause:** Cookie not being set

**Fix:**
1. Check `nextCookies()` plugin is in auth config
2. In production, ensure `BETTER_AUTH_URL` uses HTTPS
3. Check browser isn't blocking cookies

### Database Errors

**"table user already exists":**
- Drop tables: `rm local.db` (dev only!)
- Run: `bun db:push`

**"no such table: user":**
- Schema not pushed
- Run: `bun db:push`

### TypeScript Errors

**"Property 'x' does not exist on type 'User'":**
- Regenerate types after schema changes
- Restart TypeScript server in IDE

### Proxy Not Working

**Logs not showing:**
- Ensure file is at `src/proxy.ts` (not root)
- Check function is named `proxy`
- Restart dev server

**Redirects not happening:**
- Check `matcher` in config
- Ensure route matches pattern

---

## Advanced Topics

### Custom Database Adapter

Want to use PostgreSQL, MongoDB, etc.?

See [Better Auth Adapters](https://www.better-auth.com/docs/concepts/database#adapters)

### Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// src/app/api/auth/[...all]/route.ts
import { rateLimit } from "@/lib/rate-limit";

export const POST = async (req: Request) => {
  await rateLimit(req); // Implement this
  return toNextJsHandler(auth).POST(req);
};
```

### Multi-Factor Authentication

Better Auth supports 2FA. See [Better Auth 2FA docs](https://www.better-auth.com/docs/plugins/two-factor)

### Custom Email Templates

Style your verification/reset emails:

```typescript
sendVerificationEmail: async ({ user, url }) => {
  await sendEmail({
    to: user.email,
    subject: "Verify Email",
    html: `
      <div style="...">
        <h1>Welcome!</h1>
        <a href="${url}">Verify Email</a>
      </div>
    `,
  });
},
```

---

## Getting Help

- **Better Auth Docs:** https://www.better-auth.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team/docs

---

## What's Next?

Now that you understand the template:

1. **Customize** the landing page for your app
2. **Add** your app's features
3. **Deploy** to production
4. **Build** something awesome! 🚀

Happy coding!

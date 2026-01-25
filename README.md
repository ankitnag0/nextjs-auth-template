# Next.js Auth Template

Production-ready authentication template for Next.js applications with Better Auth, Drizzle ORM, and shadcn/ui components.

## ⚠️ Package Manager: Bun Only

**This project uses [Bun](https://bun.sh) exclusively.** Do NOT use npm, yarn, or pnpm.

```bash
# Install bun if you haven't
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Run development server
bun dev
```

## Features

- 🔐 **Authentication** - Email/password + Google OAuth with [Better Auth](https://www.better-auth.com/)
- 🗄️ **Database** - [Drizzle ORM](https://orm.drizzle.team/) with libsql/Turso support
- 🎨 **UI Components** - [shadcn/ui](https://ui.shadcn.com/) with Tailwind CSS v4
- 🌗 **Dark Mode** - Built-in light/dark theme support
- 🔒 **Protected Routes** - Next.js 16 proxy + server-side validation
- 👁️ **Password Toggle** - Show/hide password functionality
- ✨ **Type-Safe** - Full TypeScript support

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Auth**: Better Auth v1.4
- **Database**: Drizzle ORM + libsql (SQLite)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Runtime**: Bun
- **Language**: TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- Node.js 20+ (for compatibility)

### Installation

```bash
# Clone the template
git clone <your-repo-url>
cd nextjs-auth-template

# Install dependencies (bun only!)
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to `/signin`.

### Database Setup

The template uses a local SQLite database (`local.db`) by default.

```bash
# Generate migrations
bun db:generate

# Push schema to database
bun db:push

# Open Drizzle Studio (database GUI)
bun db:studio
```

### Google OAuth Setup (Optional)

To enable Google sign-in:

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy **Client ID** and **Client Secret**

2. **Add Environment Variables:**
   
   Create a `.env` file (see `.env.example`):
   
   ```env
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

3. **Restart Development Server:**
   
   ```bash
   bun dev
   ```

Google sign-in buttons will now work on `/signin` and `/signup` pages!

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...all]/     # Better Auth API routes
│   ├── signin/                 # Sign in page
│   ├── signup/                 # Sign up page
│   └── page.tsx                # Protected home page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── login-form.tsx          # Login form component
│   ├── signup-form.tsx         # Signup form component
│   └── logout-button.tsx       # Logout button
├── db/
│   ├── schema/                 # Database schemas
│   └── index.ts                # Database client
└── lib/
    ├── auth.ts                 # Better Auth server config
    ├── auth-client.ts          # Better Auth client
    └── utils.ts                # Utilities
```

## Creating Your Own App from This Template

### 1. Clone and Rename

```bash
# Clone the template
git clone <your-repo-url> my-new-app
cd my-new-app

# Remove git history (optional)
rm -rf .git
git init
```

### 2. Update Project Name

**package.json**:
```json
{
  "name": "my-new-app",
  "version": "0.1.0"
}
```

**src/app/layout.tsx**:
```tsx
export const metadata: Metadata = {
  title: "My New App",
  description: "Description of my new app",
};
```

### 3. Configure Database (Optional)

To use Turso instead of local SQLite:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create my-app-db

# Get connection URL and auth token
turso db show my-app-db
```

Update `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  // ...
});
```

Create `.env`:
```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

### 4. Install and Run

```bash
# Install dependencies
bun install

# Push database schema
bun db:push

# Run dev server
bun dev
```

## Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint

bun db:generate  # Generate migrations
bun db:push      # Push schema to database
bun db:migrate   # Run migrations
bun db:studio    # Open Drizzle Studio
```

## Adding More Auth Providers

Google OAuth is already configured! To add more providers (GitHub, Discord, etc.):

1. Get OAuth credentials from the provider
2. Add provider config to `src/lib/auth.ts` socialProviders
3. Add environment variables to `.env`
4. Update login/signup forms with new provider buttons

See [Better Auth Providers](https://www.better-auth.com/docs/authentication/social) for all options.

## Customization

### Adding Components

```bash
# Use shadcn CLI to add more components
bunx shadcn@latest add [component-name]
```

### Extending Database Schema

1. Add/modify schemas in `src/db/schema/`
2. Generate migration: `bun db:generate`
3. Apply changes: `bun db:push`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

### Other Platforms

This template works on any platform supporting Next.js and Bun:
- Vercel
- Netlify
- Railway
- Fly.io
- Self-hosted

## Contributing

This is a template project. Fork it and make it your own!

## License

MIT

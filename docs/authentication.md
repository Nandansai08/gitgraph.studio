# GitGraph Studio Authentication

GitGraph Studio uses Auth.js v5 with the Prisma adapter. The current app supports GitHub OAuth, Google OAuth, and credentials sign-in for users that already have a stored password hash.

## Auth Providers

Provider setup lives in [`auth.ts`](../auth.ts):

| Provider | Auth.js ID | Environment variables | User profile mapping |
| --- | --- | --- | --- |
| GitHub | `github` | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` | `id`, `name`, `email`, `image`, `username`, `bio` |
| Google | `google` | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | `id`, `name`, `email`, `image`, generated `username`, default `bio` |
| Credentials | `credentials` | none beyond database access | Existing `User` rows with `hashedPassword` |

Auth.js also requires `AUTH_SECRET`. Local development uses `NEXTAUTH_URL=http://localhost:3000`; deployed environments should set `NEXTAUTH_URL` to the public site URL.

## Callback URLs

Use these redirect/callback URLs when registering OAuth apps:

| Provider | Local callback URL | Production callback URL |
| --- | --- | --- |
| GitHub | `http://localhost:3000/api/auth/callback/github` | `https://YOUR_DOMAIN/api/auth/callback/github` |
| Google | `http://localhost:3000/api/auth/callback/google` | `https://YOUR_DOMAIN/api/auth/callback/google` |

Replace `YOUR_DOMAIN` with the exact deployed host. The scheme and host must match `NEXTAUTH_URL`.

## GitHub OAuth Setup

1. Open GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App.
2. Set Application name to `GitGraph Studio` or another clear project name.
3. Set Homepage URL:
   - Local: `http://localhost:3000`
   - Production: `https://YOUR_DOMAIN`
4. Set Authorization callback URL:
   - Local: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://YOUR_DOMAIN/api/auth/callback/github`
5. Create the app, then generate a client secret.
6. Copy the Client ID into `AUTH_GITHUB_ID`.
7. Copy the Client secret into `AUTH_GITHUB_SECRET`.

GitHub OAuth Apps do not require selecting scopes during app creation. Auth.js requests the default profile and email data needed by the `profile` mapper in `auth.ts`.

## Google OAuth Setup

1. Open Google Cloud Console -> APIs & Services -> Credentials.
2. Create or select a project for GitGraph Studio.
3. Configure the OAuth consent screen:
   - App type: External for public testing, or Internal for a Google Workspace-only app.
   - App name: `GitGraph Studio`
   - User support email and developer contact email: your project contact.
4. Create Credentials -> OAuth client ID -> Web application.
5. Add Authorized JavaScript origins:
   - Local: `http://localhost:3000`
   - Production: `https://YOUR_DOMAIN`
6. Add Authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://YOUR_DOMAIN/api/auth/callback/google`
7. Copy the Client ID into `AUTH_GOOGLE_ID`.
8. Copy the Client secret into `AUTH_GOOGLE_SECRET`.

Google sign-in uses the standard OpenID Connect profile claims returned by Auth.js, including subject ID, name, email, and profile image.

## Environment Example

```env
AUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

## Local Verification

1. Copy `.env.example` to `.env`.
2. Fill in the database variables, `AUTH_SECRET`, and the OAuth credentials.
3. Run the app:

```bash
npm run dev
```

4. Open `http://localhost:3000/auth`.
5. Test GitHub sign-in and Google sign-in separately.
6. Confirm the callback returns to the app without a provider error.

If an OAuth provider returns a redirect mismatch error, compare the provider dashboard callback URL with `NEXTAUTH_URL` and the callback table above.

## Protected Routes

Route protection lives in [`middleware.ts`](../middleware.ts). Keep middleware matchers aligned with auth-gated features such as saving, forking, exporting, gallery publishing, likes, bookmarks, and comments.

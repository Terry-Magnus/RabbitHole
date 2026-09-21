import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

export function createAuth(
  prisma: PrismaClient,
  secret: string,
  baseURL: string,
  adminEmails: string,
  webAppOrigin: string,
) {
  const normalizedAdminEmails = adminEmails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    secret,
    baseURL,
    basePath: '/api/auth',
    // Better Auth's own origin-trust check (separate from Nest's CORS
    // config in main.ts) rejects state-changing requests — e.g. sign-out —
    // from any origin not listed here. Found only by testing sign-out live:
    // it failed with "Invalid origin" even from the correctly-CORS-enabled
    // frontend, since trustedOrigins has no default covering a frontend on
    // a different origin than baseURL. Reuses the same WEB_APP_ORIGIN
    // already used for CORS, so the two never drift apart.
    trustedOrigins: [webAppOrigin],
    emailAndPassword: {
      enabled: true,
      // No email-sending infrastructure exists anywhere in this project —
      // requiring verification with no way to ever send that email would
      // make registration unusable. See context/specs/12-authentication.md.
      requireEmailVerification: false,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'USER',
          // Never settable by the client's own sign-up request body —
          // only this server-side hook (below) may assign a role.
          input: false,
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          // Bootstraps the very first Administrator account(s): an email
          // listed in ADMIN_EMAILS becomes ADMIN at registration time,
          // everyone else becomes USER. See context/specs/12-authentication.md
          // for the documented fallback (a manual SQL UPDATE) if an admin
          // registers before this env var is set.
          before: (user: { email: string }) => {
            const role = normalizedAdminEmails.includes(
              user.email.toLowerCase(),
            )
              ? 'ADMIN'
              : 'USER';

            return Promise.resolve({ data: { role } });
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;

// Standalone entry point for the Better Auth CLI (`npx @better-auth/cli generate`).
// The CLI needs a plain `auth` export it can load outside of Nest's DI container;
// the actual NestJS-wired instance (using PrismaService) lives in src/auth/auth.module.ts.
import { PrismaClient } from '@prisma/client';
import { createAuth } from './src/auth/auth.instance';

const prisma = new PrismaClient();

export const auth = createAuth(
  prisma,
  process.env.BETTER_AUTH_SECRET ?? '',
  process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',
  process.env.ADMIN_EMAILS ?? '',
  process.env.WEB_APP_ORIGIN ?? 'http://localhost:3000',
);

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

export function createAuth(
  prisma: PrismaClient,
  secret: string,
  baseURL: string,
) {
  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    secret,
    baseURL,
    basePath: '/api/auth',
  });
}

export type Auth = ReturnType<typeof createAuth>;

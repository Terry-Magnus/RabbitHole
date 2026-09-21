import type { Auth } from './auth.instance';

// Derived from Better Auth's own getSession return type rather than
// hand-duplicated, so it can never drift from the real session.user shape
// (including the additionalFields.role Unit 12 wired up).
type SessionUser = NonNullable<
  Awaited<ReturnType<Auth['api']['getSession']>>
>['user'];

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};

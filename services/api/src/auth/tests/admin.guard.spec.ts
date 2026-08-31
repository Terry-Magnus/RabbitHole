import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import type { Auth } from '../auth.instance';

function makeAuth(getSessionResult: unknown): Auth {
  return {
    api: {
      getSession: jest.fn().mockResolvedValue(getSessionResult),
    },
  } as unknown as Auth;
}

function makeContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers: { cookie: 'session=abc' } }),
    }),
  } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
  it('allows a request through for an admin session', async () => {
    const auth = makeAuth({ user: { role: 'ADMIN' } });
    const guard = new AdminGuard(auth);

    await expect(guard.canActivate(makeContext())).resolves.toBe(true);
  });

  it('rejects with 401 when there is no session', async () => {
    const auth = makeAuth(null);
    const guard = new AdminGuard(auth);

    await expect(guard.canActivate(makeContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects with 403 for a signed-in non-admin session', async () => {
    const auth = makeAuth({ user: { role: 'USER' } });
    const guard = new AdminGuard(auth);

    await expect(guard.canActivate(makeContext())).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});

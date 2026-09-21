import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AUTH_INSTANCE } from '../auth.constants';
import type { Auth } from '../auth.instance';

// Express's req.headers values are string | string[] | undefined; Better
// Auth's session check wants a fetch-style Headers object.
function toFetchHeaders(expressHeaders: Request['headers']): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(expressHeaders)) {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else if (value !== undefined) {
      headers.append(key, value);
    }
  }

  return headers;
}

// Unlike AdminGuard, any signed-in user passes — no role check. This is
// also the first guard in the app that any controller actually needs to
// read *who* is asking (every admin controller so far only needed to know
// *whether* the caller was an admin), so it attaches the resolved user to
// request.user for the controller to use.
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(@Inject(AUTH_INSTANCE) private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = await this.auth.api.getSession({
      headers: toFetchHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedException('Sign in required.');
    }

    request.user = session.user;

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(AUTH_INSTANCE) private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = await this.auth.api.getSession({
      headers: toFetchHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedException('Sign in required.');
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenException('Administrator access required.');
    }

    return true;
  }
}

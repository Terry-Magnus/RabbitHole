import { All, Controller, Inject, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';
import { AUTH_INSTANCE } from './auth.constants';
import type { Auth } from './auth.instance';

@Controller('api/auth')
export class AuthController {
  private readonly handler: ReturnType<typeof toNodeHandler>;

  constructor(@Inject(AUTH_INSTANCE) auth: Auth) {
    this.handler = toNodeHandler(auth);
  }

  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.handler(req, res);
  }
}

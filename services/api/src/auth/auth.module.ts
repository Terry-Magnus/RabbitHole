import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.validation';
import { PrismaModule } from '../shared/prisma.module';
import { PrismaService } from '../shared/prisma.service';
import { AUTH_INSTANCE } from './auth.constants';
import { AuthController } from './auth.controller';
import { createAuth } from './auth.instance';
import { AdminGuard } from './guards/admin.guard';
import { SessionGuard } from './guards/session.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_INSTANCE,
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService<Env, true>) =>
        createAuth(
          prisma,
          config.get('BETTER_AUTH_SECRET', { infer: true }),
          config.get('BETTER_AUTH_URL', { infer: true }),
          config.get('ADMIN_EMAILS', { infer: true }),
          config.get('WEB_APP_ORIGIN', { infer: true }),
        ),
    },
    AdminGuard,
    SessionGuard,
  ],
  // AUTH_INSTANCE must be exported alongside the guards, not just the
  // guards themselves: @UseGuards(...) resolves a guard's own constructor
  // dependencies (AUTH_INSTANCE) from the *consuming* module's DI context,
  // not AuthModule's — confirmed by hitting the real
  // UnknownDependenciesException this omission produces at boot.
  exports: [AdminGuard, SessionGuard, AUTH_INSTANCE],
})
export class AuthModule {}

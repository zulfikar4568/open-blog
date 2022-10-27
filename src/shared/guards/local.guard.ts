import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { JsonWebTokenError } from 'jsonwebtoken';
import {
  ForbiddenException,
  UnauthorizedException,
} from '../exceptions/common.exception';
import { TUserCompact } from '../types/user.type';
import log from '../utils/log.util';

enum EErrorJwtCode {
  TOKEN_EXPIRED = 'T401',
  TOKEN_INVALID = 'T402',
  TOKEN_REQUIRED = 'T403',
}
export default class AuthLocalGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<TUser = TUserCompact>(
    err: any,
    user: any,
    info: any,
    context: any,
  ): TUser {
    if (info) {
      if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException({
          code: EErrorJwtCode.TOKEN_EXPIRED,
          message: 'token expired!',
          params: { message: info.message },
        });
      }
      if (info.message === 'No auth token') {
        throw new UnauthorizedException({
          message: 'token required!',
          code: EErrorJwtCode.TOKEN_REQUIRED,
          params: { message: info.message },
        });
      }
    }

    if (err || info || user) {
      if (
        err instanceof JsonWebTokenError ||
        info instanceof JsonWebTokenError ||
        !user
      ) {
        throw new UnauthorizedException({
          message: 'invalid token!',
          code: EErrorJwtCode.TOKEN_INVALID,
          params: {
            message: err?.message || info?.message || 'user not found',
          },
        });
      }
    }

    const compactUser = user as TUserCompact;

    let isAuthorized = true;
    try {
      const requiredRoles = [
        Role.ADMIN,
        ...this.reflector.getAllAndOverride<Role[]>('authorization', [
          context.getHandler(),
          context.getClass(),
        ]),
      ];

      const checkRoles = requiredRoles.filter((x) =>
        compactUser.roles?.includes(x),
      );

      isAuthorized = !!checkRoles.length;
    } catch (error) {
      const req = context.getRequest();
      log.warn(`skip authorization for ${req.route?.path || req.url}`);
    }

    if (!isAuthorized) {
      throw new ForbiddenException();
    }

    return compactUser as any;
  }
}

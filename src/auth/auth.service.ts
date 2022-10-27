import { HttpStatus, Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import dayjs from 'dayjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { IRegisterRequestBody } from './requests/register-local.request';
import { UserService } from '@/modules/users/user.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { TUserCompact, TUserFull } from '@/shared/types/user.type';
import { generateJwt, IGeneratedJwt } from '@/shared/utils/jwt.util';
import { checkPassword, generatePassword } from '@/shared/utils/password.util';
import { transformUserToCompact } from '@/shared/utils/user.util';
import { PrismaService } from '@/prisma/prisma.service';
import log from '@/shared/utils/log.util';

export type TLogin = {
  email: string;
  password: string;
};

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly db: PrismaService,
  ) {}

  public async logout(userId: number): Promise<void> {
    try {
      await this.db.session.deleteMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  public async createSession(
    ctx: IContext,
    user: TUserCompact,
    jwt: IGeneratedJwt,
  ): Promise<Session> {
    const headers = Object.assign({}, ctx.headers);

    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    const session = await this.db.session.create({
      data: {
        userId: user.id,
        token: jwt.token,
        refresh: jwt.refresh,
        data: { user: instanceToPlain(user), headers },
        expiredAt: jwt.expired,
      },
    });

    return session;
  }

  async registerAccount(
    ctx: IContext,
    body: IRegisterRequestBody,
  ): Promise<Session> {
    const checkUser = await this.userService.findByEmail(
      body.email,
      this.userService.includes(),
    );

    if (checkUser) {
      if (checkUser.password) {
        throw new UnauthorizedException({
          code: '401',
          message: 'User already exists!',
          params: {
            email: body.email,
          },
        });
      }
    }

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException({
        code: '401',
        message: 'Password missmatch!',
      });
    }

    const userUpdate = await this.userService.createUser({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      password: await generatePassword(body.password),
    });

    const { jwt, user } = await this.login(ctx, userUpdate);
    return await this.createSession(ctx, user, jwt);
  }

  async loginOAuth(
    ctx: IContext,
    mode: 'facebook' | 'google',
  ): Promise<Session> {
    if (!ctx.user) {
      throw new BadRequestException({
        code: '401',
        message: `Failed login with ${mode}!`,
      });
    }

    const userCtx = ctx.user;

    const userCheck =
      mode === 'facebook'
        ? await this.userService.findByFacebookId(
            ctx.user.facebookId,
            this.userService.includes(),
          )
        : await this.userService.findByGoogleId(
            ctx.user.googleId,
            this.userService.includes(),
          );

    if (userCheck) {
      const { jwt, user } = await this.login(ctx, userCheck);
      return await this.createSession(ctx, user, jwt);
    }

    try {
      const userCreate = await this.userService.createUser({
        email: userCtx.email,
        firstName: userCtx.firstName,
        lastName: userCtx.lastName,
        facebookId: userCtx.facebookId,
        imageUrl: userCtx.imageUrl,
        googleId: userCtx.googleId,
      });

      const { jwt, user } = await this.login(ctx, userCreate);
      return await this.createSession(ctx, user, jwt);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async loginWithLocal(
    ctx: IContext,
    { email, password }: TLogin,
  ): Promise<Session> {
    const userCheck = await this.userService.findByEmail(
      email,
      this.userService.includes(),
    );

    if (!userCheck) {
      throw new NotFoundException({
        code: '404',
        message: 'User not found!',
        params: { email },
      });
    }
    if (!userCheck.password) {
      throw new BadRequestException({
        code: '401',
        message: 'Password is needed for login!',
      });
    }
    const isMatch = await checkPassword(password, userCheck.password);

    if (!isMatch) {
      throw new BadRequestException({
        code: '401',
        message: 'Wrong Password!',
      });
    }

    const { jwt, user } = await this.login(ctx, userCheck);
    return await this.createSession(ctx, user, jwt);
  }

  async login(
    ctx: IContext,
    user: TUserFull,
  ): Promise<{
    user: TUserCompact;
    jwt: IGeneratedJwt;
  }> {
    const compactUser = transformUserToCompact(user);

    const jwt = await generateJwt({
      origin: ctx.headers?.['origin'] || 'http://localhost',
      userId: user.id,
      user: compactUser,
    });

    return { user: compactUser, jwt };
  }

  public async refresh(ctx: IContext): Promise<Session> {
    const refreshToken = ctx.refreshToken;
    if (refreshToken === undefined)
      throw new NotFoundException({
        code: '404',
        message:
          'please provide refresh token, or you request login first before proceed!',
      });

    const user = ctx.user as TUserCompact;
    const headers = Object.assign({}, ctx.headers);

    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    const currentSession = await this.db.session.findUnique({
      where: {
        refresh: refreshToken,
      },
    });

    if (!currentSession) {
      throw new BadRequestException({
        code: '401',
        message: 'Invalid Refresh Token!',
      });
    }

    if (dayjs().isAfter(currentSession.expiredAt)) {
      const expiredAt = dayjs(currentSession.expiredAt).format();
      throw new BadRequestException({
        code: '401',
        message: `refresh token expired since ${expiredAt}`,
        params: {
          expiredAt,
        },
      });
    }

    const jwt = await generateJwt({
      origin: ctx.headers?.['origin'] || 'http://localhost',
      userId: Number(currentSession.userId),
      user,
    });

    const session = await this.db.session.update({
      where: {
        refresh: refreshToken,
      },
      data: {
        userId: Number(currentSession.userId),
        token: jwt.token,
        refresh: jwt.refresh,
        data: { user: instanceToPlain(user), headers },
        expiredAt: jwt.expired,
      },
    });

    return session;
  }
}

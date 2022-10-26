import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ICreateGoogleUserRequest } from './requests/create-user.request';
import { PrismaService } from '@/prisma/prisma.service';
import { TUserFull } from '@/shared/types/user.type';
import log from '@/shared/utils/log.util';
import { UnknownException } from '@/shared/exceptions/common.exception';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  public async createGoogleUser(
    body: ICreateGoogleUserRequest,
  ): Promise<TUserFull> {
    try {
      const user = await this.db.user.create({
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          googleId: body.googleId,
          imageUrl: body.imageUrl,
        },
        include: this.includes(),
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when create user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  public async findByEmail(
    email: string,
    include: Prisma.UserInclude,
  ): Promise<TUserFull | null> {
    const result = await this.db.user.findUnique({
      where: {
        email,
      },
      include,
    });

    return result as TUserFull;
  }

  public async findByGoogleId(
    googleId: string,
    include: Prisma.UserInclude,
  ): Promise<TUserFull | null> {
    const result = await this.db.user.findFirst({
      where: {
        googleId: googleId,
      },
      include,
    });

    return result as TUserFull;
  }

  public includes = () => ({
    posts: true,
    sessions: true,
  });
}

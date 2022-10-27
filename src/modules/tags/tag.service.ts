import { HttpStatus, Injectable } from '@nestjs/common';
import { Role, Tag } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ICreateTagRequestBody } from './requests/create-tag.request';
import { IDeleteTagRequestParams } from './requests/delete-tag.request';
import { IGetTagRequestParams } from './requests/get-tag.request';
import {
  IUpdateTagRequestBody,
  IUpdateTagRequestParams,
} from './requests/update-tag.request';
import log from '@/shared/utils/log.util';
import {
  NotFoundException,
  UnauthorizedException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import { PrismaService } from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { TUserCompact } from '@/shared/types/user.type';

@Injectable()
export class TagService {
  constructor(private readonly db: PrismaService) {}

  private checkPermission(ctx: IContext, tag: Tag) {
    const user = ctx.user as TUserCompact;

    if (!user.id)
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED.toString(),
        message: 'You need login first!',
      });

    if (!user.roles?.includes(Role.ADMIN)) {
      if (user.id !== tag?.userId) {
        throw new UnauthorizedException({
          code: HttpStatus.UNAUTHORIZED.toString(),
          message: "You can't change a tag which not yours!",
        });
      }
    }
  }

  async createTag(ctx: IContext, body: ICreateTagRequestBody) {
    try {
      const user = ctx.user as TUserCompact;

      if (!user.id)
        throw new UnauthorizedException({
          code: HttpStatus.UNAUTHORIZED.toString(),
          message: 'You need login first!',
        });

      const newData = { ...body, ...{ userId: user.id } };

      const tag = await this.db.tag.create({
        data: newData,
      });

      return tag;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Create Tag!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async deleteTag(
    ctx: IContext,
    params: IDeleteTagRequestParams,
  ): Promise<Tag> {
    try {
      const checkTag = await this.db.tag.findUnique({
        where: {
          id: Number(params.id),
        },
      });

      if (!checkTag) {
        throw new NotFoundException({
          code: '404',
          message: 'Tag is not found!',
          params: params,
        });
      }

      this.checkPermission(ctx, checkTag);

      const tagDeleted = await this.db.tag.delete({
        where: {
          id: Number(params.id),
        },
      });

      return tagDeleted;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Delete Tag!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async updateTag(
    ctx: IContext,
    params: IUpdateTagRequestParams,
    body: IUpdateTagRequestBody,
  ) {
    const checkTag = await this.db.tag.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!checkTag) {
      throw new NotFoundException({
        code: '404',
        message: 'Tag is not found!',
        params: params,
      });
    }

    this.checkPermission(ctx, checkTag);

    try {
      const tag = await this.db.tag.upsert({
        where: { id: Number(params.id) },
        create: { ...checkTag, ...body },
        update: { ...checkTag, ...body },
      });

      return tag;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Update Tag!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async getTagById(params: IGetTagRequestParams) {
    const tag = await this.db.tag.findUnique({
      where: { id: Number(params.id) },
    });

    if (!tag) {
      throw new NotFoundException({
        code: '404',
        message: 'Tag is not found!',
        params: params,
      });
    }

    return tag;
  }
  async getAllTags() {
    try {
      const result = await this.db.tag.findMany();
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when get all Tag!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}

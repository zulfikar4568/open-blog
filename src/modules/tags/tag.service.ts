import { HttpStatus, Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
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
  UnknownException,
} from '@/shared/exceptions/common.exception';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly db: PrismaService) {}

  async createTag(body: ICreateTagRequestBody) {
    try {
      const tag = await this.db.tag.create({
        data: body,
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
  async deleteTag(params: IDeleteTagRequestParams): Promise<Tag> {
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

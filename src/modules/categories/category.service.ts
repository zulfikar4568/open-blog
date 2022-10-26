import { HttpStatus, Injectable } from '@nestjs/common';
import { Category, Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ICreateCategoryRequestBody } from './requests/create-category.request';
import { IDeleteCategoryRequestParams } from './requests/delete-category.request';
import { IGetCategoryRequestParams } from './requests/get-category.request';
import {
  IUpdateCategoryRequestBody,
  IUpdateCategoryRequestParams,
} from './requests/update-category.requet';
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
export class CategoryService {
  constructor(private readonly db: PrismaService) {}

  private checkPermission(ctx: IContext, category: Category) {
    const user = ctx.user as TUserCompact;

    if (!user.id)
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED.toString(),
        message: 'You need login first!',
      });

    if (!user.roles?.includes(Role.ADMIN)) {
      if (user.id !== category?.userId) {
        throw new UnauthorizedException({
          code: HttpStatus.UNAUTHORIZED.toString(),
          message: "You can't change a category which not yours!",
        });
      }
    }
  }

  async createCategory(
    ctx: IContext,
    body: ICreateCategoryRequestBody,
  ): Promise<Category> {
    try {
      const user = ctx.user as TUserCompact;

      if (!user.id)
        throw new UnauthorizedException({
          code: HttpStatus.UNAUTHORIZED.toString(),
          message: 'You need login first!',
        });

      const newData = { ...body, ...{ userId: user.id } };

      const category = await this.db.category.create({
        data: newData,
      });

      return category;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Create Category!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async deleteCategory(
    ctx: IContext,
    params: IDeleteCategoryRequestParams,
  ): Promise<Category> {
    try {
      const checkCategory = await this.db.category.findUnique({
        where: {
          id: Number(params.id),
        },
      });

      if (!checkCategory) {
        throw new NotFoundException({
          code: '404',
          message: 'Category is not found!',
          params: params,
        });
      }

      this.checkPermission(ctx, checkCategory);

      const categoryDeleted = await this.db.category.delete({
        where: {
          id: Number(params.id),
        },
      });

      return categoryDeleted;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Delete Category!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async updateCategory(
    ctx: IContext,
    params: IUpdateCategoryRequestParams,
    body: IUpdateCategoryRequestBody,
  ): Promise<Category> {
    const checkCategory = await this.db.category.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!checkCategory) {
      throw new NotFoundException({
        code: '404',
        message: 'Category is not found!',
        params: params,
      });
    }

    this.checkPermission(ctx, checkCategory);

    try {
      const category = await this.db.category.upsert({
        where: { id: Number(params.id) },
        create: { ...checkCategory, ...body },
        update: { ...checkCategory, ...body },
      });

      return category;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Update Category!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async getCategoryById(params: IGetCategoryRequestParams): Promise<Category> {
    const category = await this.db.category.findUnique({
      where: { id: Number(params.id) },
    });

    if (!category) {
      throw new NotFoundException({
        code: '404',
        message: 'Category is not found!',
        params: params,
      });
    }

    return category;
  }
  async getAllCategories() {
    try {
      const result = await this.db.category.findMany();
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when get all Category!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}

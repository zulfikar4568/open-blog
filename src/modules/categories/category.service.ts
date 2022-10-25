import { HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
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
  UnknownException,
} from '@/shared/exceptions/common.exception';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly db: PrismaService) {}

  async createCategory(body: ICreateCategoryRequestBody): Promise<Category> {
    try {
      const category = await this.db.category.create({
        data: body,
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

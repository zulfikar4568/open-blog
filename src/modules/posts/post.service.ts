import { HttpStatus, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {
  INewDataPostRequest,
  IUpdatePostRequestBody,
  IUpdatePostRequestParams,
} from './requests/update-post.request';
import { ICreatePostRequestBody } from './requests/create-post.request';
import { IDeletePostRequestParams } from './requests/delete-post.request';
import { IGetPostRequestParams } from './requests/get-post.request';
import { TListPostRequestQuery } from './requests/list-post.request';
import log from '@/shared/utils/log.util';
import {
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import { PrismaService } from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import {
  parseMetaCursor,
  parseQueryCursor,
} from '@/shared/utils/query-cursor.util';

@Injectable()
export class PostService {
  constructor(private readonly db: PrismaService) {}

  async createPost(body: ICreatePostRequestBody): Promise<Post> {
    try {
      const post = await this.db.post.create({
        data: {
          userId: body.userId,
          counterLike: 0,
          lastRead: new Date(Date.now()),
          title: body.title,
          imageCover: body.imageCover,
          isPublished: body.isPublished,
          summary: body.summary,
          postContents: body.postContents,
          categories: {
            create: body.categories.map((category) => ({
              category: { connect: { id: category } },
            })),
          },
          tags: {
            create: body.tags.map((tag) => ({
              tag: { connect: { id: tag } },
            })),
          },
        },
        include: this.includes(),
      });

      return post;
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

  async updatePost(
    params: IUpdatePostRequestParams,
    body: IUpdatePostRequestBody,
  ): Promise<Post> {
    const checkPost = await this.db.post.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!checkPost) {
      throw new NotFoundException({
        code: '404',
        message: 'Post is not found!',
        params: params,
      });
    }

    const newData: INewDataPostRequest = {
      ...body,
      tags: {
        deleteMany: {},
        create: body.tags.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
      categories: {
        deleteMany: {},
        create: body.categories.map((tagId) => ({
          category: { connect: { id: tagId } },
        })),
      },
    };

    try {
      const post = await this.db.post.update({
        where: { id: Number(params.id) },
        data: newData,
        include: this.includes(),
      });

      return post;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Update Post!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async deletePost(params: IDeletePostRequestParams) {
    try {
      const checkPost = await this.db.post.findUnique({
        where: {
          id: Number(params.id),
        },
      });

      if (!checkPost) {
        throw new NotFoundException({
          code: '404',
          message: 'Post is not found!',
          params: params,
        });
      }

      const postDeleted = await this.db.post.delete({
        where: {
          id: Number(params.id),
        },
        include: this.includes(),
      });

      return postDeleted;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected when Delete post!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
  async getPostById(params: IGetPostRequestParams) {
    const post = await this.db.post.findUnique({
      where: { id: Number(params.id) },
      include: this.includes(),
    });

    if (!post) {
      throw new NotFoundException({
        code: '404',
        message: 'Post is not found!',
        params: params,
      });
    }

    return post;
  }

  async listPosts(ctx: IContext): Promise<{
    result: Post[];
    meta: {
      count: number;
      total: number;
      lastCursor: number;
      totalPage: number;
    };
  }> {
    const query = ctx.params.query as TListPostRequestQuery;

    const { limit, order, cursor } =
      parseQueryCursor<TListPostRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    let pageOptions = {
      take: limit,
    };

    if (cursor !== undefined) {
      const cursorPost = await this.db.post.findUnique({
        where: {
          id: cursor,
        },
      });

      if (!cursorPost) {
        throw new NotFoundException({
          code: '404',
          message: `Post with id ${cursor} is not found!`,
        });
      }

      pageOptions = { ...pageOptions, ...{ cursor: { id: cursor }, skip: 1 } };
    }

    const [total, posts] = await this.db.$transaction([
      this.db.post.count(selectOptions),
      this.db.post.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const lastCursor = posts.length > 0 ? posts[posts.length - 1].id : 0;

    const meta = parseMetaCursor<Post>({
      result: posts,
      total,
      lastCursor,
      limit,
    });

    return {
      result: posts,
      meta,
    };
  }

  private includes = () => ({
    categories: {
      include: {
        category: true,
      },
    },
    tags: {
      include: {
        tag: true,
      },
    },
  });
}

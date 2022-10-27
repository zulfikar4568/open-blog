import { Category, Post, PostCategory, PostTag, Tag } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class GetTagResponse implements Tag {
  userId: number;
  id: number;
  name: string;
  description: string | null;

  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdAt: Date;
}

export class GetPostTagsResponse implements PostTag {
  @Exclude()
  postId: number;

  @Exclude()
  tagId: number;

  @Type(() => GetTagResponse)
  tag: GetTagResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class GetCategoryResponse implements Category {
  userId: number;
  id: number;
  name: string;
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export class GetPostCategoriesResponse implements PostCategory {
  @Exclude()
  postId: number;

  @Exclude()
  categoryId: number;

  @Type(() => GetCategoryResponse)
  category: GetCategoryResponse;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;
}

export default class GetPostResponse implements Post {
  id: number;
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  lastRead: Date;
  counterLike: number;
  isPublished: boolean | null;

  userId: number;

  @Type(() => GetPostTagsResponse)
  tags: GetPostTagsResponse;

  @Type(() => GetPostCategoriesResponse)
  categories: GetPostCategoriesResponse;

  updatedAt: Date;
  createdAt: Date;
}

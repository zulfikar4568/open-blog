import { Category, Post, PostCategory, PostTag, Tag } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class CreateTagResponse implements Tag {
  userId: number;
  id: number;
  name: string;
  description: string | null;

  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdAt: Date;
}

export class CreatePostTagsResponse implements PostTag {
  @Exclude()
  postId: number;

  @Exclude()
  tagId: number;

  @Type(() => CreateTagResponse)
  tag: CreateTagResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class CreateCategoryResponse implements Category {
  userId: number;
  id: number;
  name: string;
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export class CreatePostCategoriesResponse implements PostCategory {
  @Exclude()
  postId: number;

  @Exclude()
  categoryId: number;

  @Type(() => CreateCategoryResponse)
  category: CreateCategoryResponse;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;
}

export default class CreatePostResponse implements Post {
  id: number;
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  lastRead: Date;
  counterLike: number;
  isPublished: boolean | null;

  userId: number;

  @Type(() => CreatePostTagsResponse)
  tags: CreatePostTagsResponse;

  @Type(() => CreatePostCategoriesResponse)
  categories: CreatePostCategoriesResponse;

  updatedAt: Date;
  createdAt: Date;
}

import { Category, Post, PostCategory, PostTag, Tag } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class UpdateTagResponse implements Tag {
  userId: number;
  id: number;
  name: string;
  description: string | null;

  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdAt: Date;
}

export class UpdatePostTagsResponse implements PostTag {
  @Exclude()
  postId: number;

  @Exclude()
  tagId: number;

  @Type(() => UpdateTagResponse)
  tag: UpdateTagResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class UpdateCategoryResponse implements Category {
  userId: number;
  id: number;
  name: string;
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export class UpdatePostCategoriesResponse implements PostCategory {
  @Exclude()
  postId: number;

  @Exclude()
  categoryId: number;

  @Type(() => UpdateCategoryResponse)
  category: UpdateCategoryResponse;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;
}

export default class UpdatePostResponse implements Post {
  id: number;
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  lastRead: Date;
  counterLike: number;
  isPublished: boolean | null;

  userId: number;

  @Type(() => UpdatePostTagsResponse)
  tags: UpdatePostTagsResponse;

  @Type(() => UpdatePostCategoriesResponse)
  categories: UpdatePostCategoriesResponse;

  updatedAt: Date;
  createdAt: Date;
}

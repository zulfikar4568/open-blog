import { Category, Post, PostCategory, PostTag, Tag } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class DeleteTagResponse implements Tag {
  id: number;
  name: string;
  description: string | null;

  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdAt: Date;
}

export class DeletePostTagsResponse implements PostTag {
  @Exclude()
  postId: number;

  @Exclude()
  tagId: number;

  @Type(() => DeleteTagResponse)
  tag: DeleteTagResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class DeleteCategoryResponse implements Category {
  id: number;
  name: string;
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export class DeletePostCategoriesResponse implements PostCategory {
  @Exclude()
  postId: number;

  @Exclude()
  categoryId: number;

  @Type(() => DeleteCategoryResponse)
  category: DeleteCategoryResponse;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;
}

export default class DeletePostResponse implements Post {
  id: number;
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  lastRead: Date;
  counterLike: number;
  isPublished: boolean | null;

  userId: number;

  @Type(() => DeletePostTagsResponse)
  tags: DeletePostTagsResponse;

  @Type(() => DeleteCategoryResponse)
  categories: DeleteCategoryResponse;

  updatedAt: Date;
  createdAt: Date;
}

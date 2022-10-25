import { Post } from '@prisma/client';

export default class ListPostResponse implements Post {
  id: number;
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  lastRead: Date;
  counterLike: number;
  isPublished: boolean | null;

  updatedAt: Date;
  createdAt: Date;
}

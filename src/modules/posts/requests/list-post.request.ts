import { Post, Prisma } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query-cursor.type';

export type TListPostRequestQuery = IListRequestQuery<
  Post,
  Prisma.PostWhereInput
>;

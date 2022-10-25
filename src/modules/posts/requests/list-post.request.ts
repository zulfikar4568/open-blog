import { Post, Prisma } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query-qursor.type';

export type TListPostRequestQuery = IListRequestQuery<
  Post,
  Prisma.PostWhereInput
>;

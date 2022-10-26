import { Category } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class GetCategoryResponse implements Category {
  userId: number;

  id: number;

  name: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

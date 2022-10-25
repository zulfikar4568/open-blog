import { Category } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class DeleteCategoryResponse implements Category {
  id: number;

  name: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

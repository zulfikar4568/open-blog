import { Tag } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class CreateTagResponse implements Tag {
  userId: number;

  id: number;

  name: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

import { Tag } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class UpdateTagResponse implements Tag {
  id: number;

  name: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

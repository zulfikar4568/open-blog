import { Session } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class SessionResponse implements Session {
  id: number;

  @Exclude()
  userId: number;

  token: string;

  refresh: string;

  @Exclude()
  data: Record<string, any>;

  expiredAt: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

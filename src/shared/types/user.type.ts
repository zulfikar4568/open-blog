import { Post, Session, User } from '@prisma/client';

export type TUserCompact = Partial<User> & {
  posts?: Post[];
  sessions?: Session;
};

export type TUserFull = User & TUserPosts;

export type TUserPosts = {
  posts: Post[];
  sessions: Session[];
};

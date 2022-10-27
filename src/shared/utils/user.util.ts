import { instanceToPlain } from 'class-transformer';
import { TUserCompact, TUserFull } from '../types/user.type';

export const transformUserToCompact = (user: TUserFull): TUserCompact => {
  const parsedUser = instanceToPlain(user) as TUserCompact;

  delete parsedUser.posts;
  delete parsedUser.sessions;

  delete parsedUser.googleId;

  delete parsedUser.password;
  delete parsedUser.createdAt;
  delete parsedUser.updatedAt;

  return parsedUser;
};

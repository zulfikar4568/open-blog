import { Prisma, Role, User } from '@prisma/client';
import appConstant from '../../src/constants/app.constant';
import { generatePassword } from '../../src/shared/utils/password.util';

type TUserSeed = {
  where: Partial<User>;
  update: Partial<User>;
  create: Partial<Prisma.UserCreateInput>;
}[];

const users = async (): Promise<TUserSeed> => [
  {
    where: { email: appConstant.ADMIN_EMAIL },
    update: {},
    create: {
      firstName: 'Administartor',
      lastName: 'User',
      email: appConstant.ADMIN_EMAIL,
      phoneNumber: appConstant.ADMIN_CONTACT,
      password: await generatePassword(appConstant.ADMIN_PASS || 'password'),
      roles: [Role.ADMIN, Role.USER],
    },
  },
];

export default users();

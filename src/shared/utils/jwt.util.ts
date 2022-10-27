import ms from 'ms';
import * as jwt from 'jsonwebtoken';

import appConstant from '@constants/app.constant';
import CryptoJS from 'crypto-js';
import { ExtractJwt } from 'passport-jwt';
import { TUserCompact } from '../types/user.type';
import { rand, sha512 } from './security.util';

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;
export interface IGeneratedJwt {
  refresh: string;
  token: string;
  expired: Date;
}

export interface IDecryptedJwt {
  payload: string;
  aud: string;
  iss: string;
  sub: string;
  exp: number;
  iat: number;
}

export const generateRefresh = async (): Promise<string> => {
  const randStr = await rand(64);
  const random = `${randStr}-${Date.now()}`;
  const refresh = await sha512(random);

  return refresh;
};

export const generateExpiredDate = (): Date => {
  const expIn = appConstant.JWT_REFRESH_EXPIRES_IN;

  return new Date(Date.now() + ms(expIn));
};

export const generateJwt = async ({
  origin,
  userId,
  user,
}: {
  origin: string;
  userId: number;
  user: TUserCompact;
}): Promise<IGeneratedJwt> => {
  const refresh = await generateRefresh();
  const token = jwt.sign(
    { payload: encryptedDataUser(user) },
    appConstant.JWT_SECRET,
    {
      expiresIn: appConstant.JWT_EXPIRES_IN,
      subject: String(userId),
      audience: origin,
      issuer: 'zulfikar-blog',
    },
  );

  const expired = generateExpiredDate();

  return {
    refresh,
    token,
    expired,
  };
};

export const jwtOptions = {
  jwtFromRequest: fromExtractors([
    cookieExtractor,
    fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: appConstant.JWT_SECRET,
  jwtCookieName: 'access-token',
};

export function cookieExtractor(req: any) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[jwtOptions.jwtCookieName];
  }
  return token;
}

export const encryptedDataUser = (user: TUserCompact) => {
  return encodeURIComponent(
    CryptoJS.AES.encrypt(
      JSON.stringify(user),
      appConstant.ECRYPTED_SECRET,
    ).toString(),
  );
};

export const decryptedDataUser = (secureData: string) => {
  const deData = CryptoJS.AES.decrypt(
    decodeURIComponent(secureData),
    appConstant.ECRYPTED_SECRET,
  );

  if (!isJsonString(deData.toString(CryptoJS.enc.Utf8))) {
    return null;
  }

  return JSON.parse(deData.toString(CryptoJS.enc.Utf8)) as TUserCompact;
};

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

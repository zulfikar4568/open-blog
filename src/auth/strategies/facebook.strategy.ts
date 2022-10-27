import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import appConstant from '@/constants/app.constant';

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: appConstant.FB_CLIENT_ID,
      clientSecret: appConstant.FB_CLIENT_SECRET,
      callbackURL: appConstant.FB_CALLBACK_URL,
      profileFields: [
        'id',
        'displayName',
        'photos',
        'email',
        'last_name',
        'first_name',
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { id, name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      imageUrl: photos[0].value,
      facebookId: id,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}

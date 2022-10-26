import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import appConstant from '@/constants/app.constant';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: appConstant.CLIENT_ID,
      clientSecret: appConstant.CLIENT_SECRET,
      callbackURL: appConstant.CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      imageUrl: photos[0].value,
      googleId: id,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}

import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UserService } from '@/modules/users/user.service';

@Module({
  controllers: [AuthController],
  providers: [
    FacebookStrategy,
    LocalStrategy,
    GoogleStrategy,
    AuthService,
    UserService,
  ],
})
export default class AuthModule {}

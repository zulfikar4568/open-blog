import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '@/modules/users/user.service';

@Module({
  controllers: [AuthController],
  providers: [LocalStrategy, GoogleStrategy, AuthService, UserService],
})
export default class AuthModule {}

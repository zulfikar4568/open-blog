import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AuthService from './auth.service';
import { LoginLocalBodyValidator } from './validators/login-local.validator';
import RefreshSessionResponse from './serializers/refresh-session.response';
import SessionResponse from './serializers/session.response';
import Authentication from '@/shared/decorators/authentication.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import AuthGoogle from '@/shared/decorators/google-auth.decorator';
import CookieAuthentication from '@/shared/decorators/cookie-auth.decorator';
import User from '@/shared/decorators/user.decorator';
import { TUserCompact } from '@/shared/types/user.type';
import Serializer from '@/shared/decorators/serializer.decorator';
import AuthFacebook from '@/shared/decorators/facebook-auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('facebook/login')
  @AuthFacebook()
  facebookLogin() {
    // Only placeholder for login Facebook
  }

  @Get('facebook/redirect')
  @AuthFacebook()
  @CookieAuthentication('login')
  @Serializer(SessionResponse)
  async signInWithFacebookRedirect(@Context() ctx: IContext) {
    const result = await this.authService.loginOAuth(ctx, 'facebook');
    return new SuccessResponse('Login Successfully!', result);
  }

  @Get('google/login')
  @AuthGoogle()
  googleLogin() {
    // Only placeholder for login google
  }

  @Get('google/redirect')
  @AuthGoogle()
  @CookieAuthentication('login')
  @Serializer(SessionResponse)
  async signInWithGoogleRedirect(@Context() ctx: IContext) {
    const result = await this.authService.loginOAuth(ctx, 'google');
    return new SuccessResponse('Login Successfully!', result);
  }

  @Post('local/login')
  @Authentication(true)
  @CookieAuthentication('login')
  @Serializer(SessionResponse)
  async signInWithLocal(
    @Context() ctx: IContext,
    @Body() body: LoginLocalBodyValidator,
  ) {
    const result = await this.authService.loginWithLocal(ctx, {
      email: body.email,
      password: body.password,
    });
    return new SuccessResponse('Login Successfully!', result);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @CookieAuthentication('logout')
  public async logout(@User() user: TUserCompact): Promise<SuccessResponse> {
    if (user.id) await this.authService.logout(user.id);
    return new SuccessResponse('logout success!', true);
  }

  @ApiBearerAuth('access-token')
  @Post('refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  @Authentication(true)
  @Serializer(RefreshSessionResponse)
  @CookieAuthentication('login')
  public async refresh(@Context() ctx: IContext): Promise<SuccessResponse> {
    const result = await this.authService.refresh(ctx);

    return new SuccessResponse('token refreshed successfully', result);
  }
}

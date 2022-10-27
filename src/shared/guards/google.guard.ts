import { AuthGuard } from '@nestjs/passport';

export default class AuthGoogleGuard extends AuthGuard('google') {}

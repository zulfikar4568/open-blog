import { AuthGuard } from '@nestjs/passport';

export default class AuthFacebookGuard extends AuthGuard('facebook') {}

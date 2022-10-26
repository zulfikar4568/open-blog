import { AuthGuard } from '@nestjs/passport';

export default class AuthLocalGuard extends AuthGuard('jwt') {}

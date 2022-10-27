import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import SuccessResponse from '../responses/success.response';
import { generateExpiredDate, generateExpireJWT } from '../utils/jwt.util';

export class LoginInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data: SuccessResponse) => {
        const response = context.switchToHttp().getResponse();
        const result = data.result;
        response.cookie('access-token', result.token, {
          expires: generateExpireJWT(),
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
        });

        response.cookie('refresh-token', result.refresh, {
          expires: generateExpiredDate(),
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
        });

        return data;
      }),
    );
  }
}

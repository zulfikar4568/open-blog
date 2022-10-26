import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import AuthModule from './auth/auth.module';
import { CategoryModule } from './modules/categories/category.module';
import { PostModule } from './modules/posts/post.module';
import { TagModule } from './modules/tags/tag.module';
import { UserModule } from './modules/users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { logger } from './shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),
    PrismaModule,

    CategoryModule,
    TagModule,
    PostModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}

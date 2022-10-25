import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CategoryModule } from './modules/categories/category.module';
import { PostModule } from './modules/posts/post.module';
import { TagModule } from './modules/tags/tag.module';
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
  ],
})
export class AppModule {}

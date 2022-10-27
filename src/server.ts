import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import appConstant from './constants/app.constant';
import UnknownExceptionsFilter from './shared/filters/unknown.filter';
import HttpExceptionFilter from './shared/filters/http.filter';
import ContextInterceptor from './shared/interceptors/context.interceptor';
import log from './shared/utils/log.util';
import ValidationPipe from './shared/pipes/validation.pipe';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(AppModule);

    // Set prefix api globally
    app.setGlobalPrefix('api');

    // Enable CORS for security
    app.enableCors({
      credentials: true,
      origin: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    // Use Exception Filter
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );

    // Versioning of default URL V1
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });

    // Use Global Interceptors
    app.useGlobalInterceptors(new ContextInterceptor());

    // Serve public images
    app.use(
      '/api/zulfikar/public',
      express.static(join(__dirname, '../../', 'public')),
    );

    // Use Cookie for http only
    app.use(cookieParser());
    const option = {
      customCss: `
      .topbar-wrapper img {content:url('https://svgshare.com/i/nhr.svg'); width:200px; height:auto;}
      .swagger-ui .topbar { background: linear-gradient(-45deg, rgba(245,0,130,1) 11%, rgba(0,94,210,1) 100%); }`,
      customfavIcon: `https://svgshare.com/i/nhr.svg`,
      customSiteTitle: 'Blog Zulfikar Documentation Services',
    };
    const config = new DocumentBuilder()
      .setTitle('Blog Zulfikar Documentation Services')
      .setDescription('This is a Blog API Documentation Zulfikar Service')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          description: `[just text field] Please enter token in following format: Bearer <JWT>`,
          name: 'Authorization',
          bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
          scheme: 'Bearer',
          type: 'http', // I`ve attempted type: 'apiKey' too
          in: 'Header',
        },
        'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/blog', app, document, option);

    const port = process.env.PORT ?? appConstant.APP_PORT;
    const host = process.env.HOST || '0.0.0.0';

    await app
      .listen(port, host)
      .then(() =>
        log.info(
          `Nest app http started at PORT: ${
            process.env.PORT ?? appConstant.APP_PORT
          }`,
        ),
      );

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  await Promise.all([httpServer]);
})();

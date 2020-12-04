import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLogger } from './logger/app-logger.provider';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { MongooseExceptionFilter } from './shared/filters/mongoose-exception.filter';
import { MongoExceptionFilter } from './shared/filters/mongo-exception.filter';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  const appVersion = 'v1';
  const protocol = configService.get('http.protocol', 'http');
  const host = configService.get('http.host', 'localhost');
  const port = configService.get('http.port', 3000);
  const rateLimitOptions = configService.get('http.rateLimit');

  const swagger = {
    title: configService.get('swagger.title'),
    description: configService.get('swagger.description'),
    version: configService.get('swagger.version'),
    path: configService.get('swagger.path'),
  };

  const logger = await app.resolve(AppLogger);
  logger.setContext('Bootstrap');

  app.setGlobalPrefix(appVersion);
  app.set('trust proxy', 1);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.use(helmet());
  app.use(rateLimit(rateLimitOptions));
  app.use(compression());

  const swaggerOptions = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .build();
  const documnet = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${appVersion}/${swagger.path}`, app, documnet);

  await app.listen(port);

  logger.log(`Server is listening at ${protocol}://${host}:${port}`);
  logger.log(
    `API swagger is open at ${protocol}://${host}:${port}/${appVersion}/${swagger.path}`,
  );
}

bootstrap();

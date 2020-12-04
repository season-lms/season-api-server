import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { DatabaseModule } from '../database/database.module';
import { catsProviders } from './cats.provider';
import { LoggerMiddleware } from './middlewares/logger-class.middleware';
import { logger } from './middlewares/logger-function.middleware';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [CatsController],
  providers: [CatsService, ...catsProviders],
  exports: [CatsService],
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(CatsController);
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}

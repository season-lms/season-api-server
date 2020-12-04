import { Injectable, NestMiddleware } from '@nestjs/common';
import {} from 'express';
import { AppLogger } from 'src/logger/app-logger.provider';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new AppLogger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: Function) {
    this.logger.log('class logger middleware');
    next();
  }
}

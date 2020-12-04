import { AppLogger } from 'src/logger/app-logger.provider';

export function logger(req, res, next) {
  const logger = new AppLogger('logger');
  logger.log('function logger middleware');
  next();
}

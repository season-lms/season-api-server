import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Error } from 'mongoose';

@Catch(Error)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = 500;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      stack: exception.stack,
    };

    switch (exception.name) {
      case 'CastError':
        Logger.error(
          `${request.method} ${request.url} mongoose ${exception.name}`,
          JSON.stringify(errorResponse),
          'ExceptionFilter',
        );
        break;
      default:
        Logger.error(
          `${request.method} ${request.url} mongoose ${exception.name}`,
          JSON.stringify(errorResponse),
          'ExceptionFilter',
        );
        break;
    }

    errorResponse.message = 'Internal database error occurred';
    delete errorResponse['stack'];
    response.status(status).json(errorResponse);
  }
}

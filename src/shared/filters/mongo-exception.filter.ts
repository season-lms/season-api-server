import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
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

    Logger.error(
      `exception`,
      JSON.stringify({ error: exception }),
      'ExceptionFilter',
    );
    switch (exception.code) {
    }

    errorResponse.message = 'Internal database error occurred';
    delete errorResponse['stack'];
    response.status(status).json(errorResponse);
  }
}
